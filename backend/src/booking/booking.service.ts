import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SYMPTOM_MAPPING = {
  fever: ['General Medicine'],
  'skin rash': ['Dermatology'],
  'joint pain': ['Orthopedics', 'Rheumatology'],
  'vision issues': ['Ophthalmology'],
  'chest pain': ['Cardiology', 'General Medicine'],
};

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async searchDoctors(query?: string, minRating?: number, maxFee?: number, mode?: string) {
    let specializationsToSearch: string[] = [];

    if (query) {
      const lowerQuery = query.toLowerCase();
      for (const [symptom, specs] of Object.entries(SYMPTOM_MAPPING)) {
        if (symptom.includes(lowerQuery) || lowerQuery.includes(symptom)) {
          specializationsToSearch.push(...specs);
        }
      }
    }

    const whereClause: any = { isAvailable: true };

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { specialization: { contains: query, mode: 'insensitive' } },
      ];
      if (specializationsToSearch.length > 0) {
        whereClause.OR.push({ specialization: { in: specializationsToSearch } });
      }
    }

    if (maxFee) {
      whereClause.consultationFee = { lte: parseFloat(maxFee.toString()) };
    }

    const doctors = await this.prisma.doctor.findMany({
      where: whereClause,
      include: {
        reviews: true,
        schedules: {
            where: { isActive: true }
        }
      }
    });

    const mappedDoctors = doctors.map(doc => {
      const totalReviews = doc.reviews.length;
      const avgRating = totalReviews > 0 
        ? doc.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      const nextAvailableSlot = this.computeNextAvailableSlot(doc.schedules);

      if (mode && !doc.schedules.some(s => s.modes === 'BOTH' || s.modes === mode)) {
          return null;
      }

      if (minRating && avgRating < parseFloat(minRating.toString())) {
        return null;
      }

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        rating: avgRating.toFixed(1),
        reviewCount: totalReviews,
        modes: doc.schedules.map(s => s.modes).join(', '),
        nextSlot: nextAvailableSlot
      };
    }).filter(d => d !== null);

    return mappedDoctors;
  }

  async getDoctorProfile(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        reviews: true,
        schedules: { where: { isActive: true } }
      }
    });

    if (!doctor) throw new BadRequestException('Doctor not found');

    const totalReviews = doctor.reviews.length;
    let avgWaitTime = 0, avgBehaviour = 0, avgTreatment = 0;
    
    if (totalReviews > 0) {
       avgWaitTime = doctor.reviews.reduce((s, r) => s + r.waitTime, 0) / totalReviews;
       avgBehaviour = doctor.reviews.reduce((s, r) => s + r.behaviour, 0) / totalReviews;
       avgTreatment = doctor.reviews.reduce((s, r) => s + r.treatment, 0) / totalReviews;
    }

    // Availability slots for next 7 days
    const next7DaysSlots = this.generate7DaySlots(doctor.schedules);

    return {
       ...doctor,
       metrics: {
           totalReviews,
           avgRating: totalReviews > 0 ? (doctor.reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : 0,
           avgWaitTime: avgWaitTime.toFixed(1),
           avgBehaviour: avgBehaviour.toFixed(1),
           avgTreatment: avgTreatment.toFixed(1)
       },
       next7DaysSlots
    };
  }

  // Engine for slot generation
  private generate7DaySlots(schedules: any[]) {
     const slots = [];
     const today = new Date();
     
     for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dayOfWeek = targetDate.getDay();

        const daySchedules = schedules.filter(s => s.dayOfWeek === dayOfWeek);
        if (daySchedules.length > 0) {
            slots.push({
                date: targetDate.toISOString().split('T')[0],
                available: true,
                sessions: daySchedules.map(schedule => {
                   const generatedSlots = [];
                   const startHour = parseInt(schedule.startTime.split(':')[0]);
                   const startMin = parseInt(schedule.startTime.split(':')[1]);
                   const endHour = parseInt(schedule.endTime.split(':')[0]);
                   const endMin = parseInt(schedule.endTime.split(':')[1]);

                   let current = new Date(targetDate);
                   current.setHours(startHour, startMin, 0, 0);

                   const end = new Date(targetDate);
                   end.setHours(endHour, endMin, 0, 0);

                   while (current < end) {
                      const timeStr = current.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                      generatedSlots.push(timeStr);
                      current.setMinutes(current.getMinutes() + schedule.slotDurationMins);
                   }

                   return {
                       type: schedule.sessionType,
                       modes: schedule.modes,
                       slots: generatedSlots
                   };
                })
            });
        } else {
            slots.push({ date: targetDate.toISOString().split('T')[0], available: false, sessions: [] });
        }
     }
     return slots;
  }

  private computeNextAvailableSlot(schedules: any[]) {
      if (!schedules || schedules.length === 0) return 'No schedules';
      // MOCK: dynamic slot finding
      return 'Today, 10:00 AM';
  }

  // Smart Booking & Cancellation
  async holdSlot(patientId: string, doctorId: string, date: string, time: string, mode: string) {
      // 5 min soft lock
      const baseDate = new Date(date);
      const [timeStr, ampm] = time.split(' ');
      const [hours, minutes] = timeStr.split(':');
      let hr = parseInt(hours);
      if (ampm === 'PM' && hr !== 12) hr += 12;
      if (ampm === 'AM' && hr === 12) hr = 0;
      baseDate.setHours(hr, parseInt(minutes), 0, 0);

      const existing = await this.prisma.appointment.findFirst({
         where: { doctorId, slotTime: baseDate, status: { in: ['CONFIRMED', 'PENDING'] } }
      });

      if (existing) {
         if (existing.softLockUntil && existing.softLockUntil > new Date() && existing.patientId !== patientId) {
             throw new BadRequestException('Slot is currently on hold by another user');
         } else if (existing.status === 'CONFIRMED') {
             throw new BadRequestException('Slot is already booked. You can join the waitlist.');
         }
      }

      const softLockEnd = new Date();
      softLockEnd.setMinutes(softLockEnd.getMinutes() + 5);

      let apt;
      if (existing && existing.patientId === patientId) {
          apt = await this.prisma.appointment.update({
             where: { id: existing.id },
             data: { softLockUntil: softLockEnd, consultationMode: mode }
          });
      } else {
          apt = await this.prisma.appointment.create({
             data: {
                patientId, doctorId, slotTime: baseDate, tokenNumber: 0,
                status: 'PENDING', bookingChannel: 'WEB', consultationMode: mode,
                softLockUntil: softLockEnd
             }
          });
      }

      return { message: 'Slot held for 5 minutes', appointmentId: apt.id, expiresAt: softLockEnd };
  }

  async confirmBooking(appointmentId: string, paymentMethod: string) {
      const apt = await this.prisma.appointment.findUnique({ where: { id: appointmentId }});
      if (!apt) throw new BadRequestException('Appointment not found');

      if (apt.softLockUntil && apt.softLockUntil < new Date()) {
          throw new BadRequestException('Hold has expired. Please try booking again.');
      }

      const startOfDay = new Date(apt.slotTime); startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(startOfDay); endOfDay.setDate(startOfDay.getDate() + 1);

      const todayApts = await this.prisma.appointment.findMany({
          where: { doctorId: apt.doctorId, slotTime: { gte: startOfDay, lt: endOfDay } }
      });
      const maxToken = todayApts.reduce((max, a) => Math.max(max, a.tokenNumber), 0);
      const tokenNumber = maxToken + 1;

      const confirmed = await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: {
              status: 'CONFIRMED', 
              tokenNumber,
              softLockUntil: null,
              paymentStatus: paymentMethod === 'PREPAID' ? 'PAID' : 'PENDING'
          }
      });

      return confirmed;
  }

  async joinWaitlist(patientId: string, doctorId: string, requestedDate: string, reason: string) {
      const urgencyScore = reason.toLowerCase().includes('urgent') || reason.toLowerCase().includes('pain') ? 10 : 0;
      
      const waitlist = await this.prisma.waitlist.create({
          data: {
             patientId, 
             doctorId, 
             requestedDate: new Date(requestedDate), 
             urgencyScore, 
             status: 'WAITING'
          }
      });
      return waitlist;
  }
}
