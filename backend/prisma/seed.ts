import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Curiq database...');

  // Clean existing data
  await prisma.staff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.billingInvoice.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.emrRecord.deleteMany();
  await prisma.queueToken.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // --- DOCTORS ---
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        id: 'doc-1',
        name: 'Dr. Aisha Patel',
        email: 'draishapatel@hospital.com',
        password: 'password123',
        specialization: 'Cardiology',
        departmentId: 'dept-cardio',
        experienceYears: 14,
        about: 'Board-certified cardiologist with 14 years of experience in interventional cardiology and heart failure management. Fellow of the American College of Cardiology.',
        consultationFee: 800,
        avgConsultationTime: 900,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-2',
        name: 'Dr. Rajesh Sharma',
        email: 'drrajeshsharma@hospital.com',
        password: 'password123',
        specialization: 'General Medicine',
        departmentId: 'dept-general',
        experienceYears: 20,
        about: 'Senior general physician specializing in chronic disease management, diabetes care, and preventive medicine. MBBS, MD (Internal Medicine).',
        consultationFee: 500,
        avgConsultationTime: 600,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-3',
        name: 'Dr. Priya Menon',
        email: 'drpriyamenon@hospital.com',
        password: 'password123',
        specialization: 'Dermatology',
        departmentId: 'dept-derm',
        experienceYears: 8,
        about: 'Consultant dermatologist specializing in clinical and cosmetic dermatology, including acne treatment, psoriasis management, and laser procedures.',
        consultationFee: 700,
        avgConsultationTime: 720,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-4',
        name: 'Dr. Vikram Singh',
        email: 'drvikramsingh@hospital.com',
        password: 'password123',
        specialization: 'Orthopedics',
        departmentId: 'dept-ortho',
        experienceYears: 16,
        about: 'Orthopedic surgeon with expertise in joint replacements, sports injuries, and arthroscopic surgery. MS (Orthopedics), DNB.',
        consultationFee: 900,
        avgConsultationTime: 840,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-5',
        name: 'Dr. Sneha Kapoor',
        email: 'drsnehakapoor@hospital.com',
        password: 'password123',
        specialization: 'Pediatrics',
        departmentId: 'dept-peds',
        experienceYears: 11,
        about: 'Pediatrician focused on child development, vaccinations, and neonatal care. DCH, MD (Pediatrics) from AIIMS.',
        consultationFee: 600,
        avgConsultationTime: 720,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-6',
        name: 'Dr. Arjun Reddy',
        email: 'drarjunreddy@hospital.com',
        password: 'password123',
        specialization: 'Neurology',
        departmentId: 'dept-neuro',
        experienceYears: 18,
        about: 'Neurologist specializing in stroke management, epilepsy, headache disorders, and neuromuscular diseases. DM (Neurology).',
        consultationFee: 1000,
        avgConsultationTime: 900,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-7',
        name: 'Dr. Fatima Khan',
        email: 'drfatimakhan@hospital.com',
        password: 'password123',
        specialization: 'Ophthalmology',
        departmentId: 'dept-ophthal',
        experienceYears: 10,
        about: 'Eye specialist with expertise in cataract surgery, LASIK, glaucoma treatment, and retinal disorders. MS (Ophthalmology).',
        consultationFee: 650,
        avgConsultationTime: 600,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-8',
        name: 'Dr. Suresh Iyer',
        email: 'drsureshiyer@hospital.com',
        password: 'password123',
        specialization: 'ENT',
        departmentId: 'dept-ent',
        experienceYears: 13,
        about: 'ENT surgeon with specialization in sinus surgery, tonsillectomy, and hearing disorders. MS (ENT), Fellowship in Head & Neck Surgery.',
        consultationFee: 600,
        avgConsultationTime: 600,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-9',
        name: 'Dr. Meera Joshi',
        email: 'drmeerajoshi@hospital.com',
        password: 'password123',
        specialization: 'Gynecology',
        departmentId: 'dept-gyn',
        experienceYears: 15,
        about: 'Obstetrician & gynecologist specializing in high-risk pregnancies, infertility, and laparoscopic surgery. MD (OB-GYN).',
        consultationFee: 750,
        avgConsultationTime: 900,
        isAvailable: true,
      },
    }),
    prisma.doctor.create({
      data: {
        id: 'doc-10',
        name: 'Dr. Karan Malhotra',
        email: 'drkaranmalhotra@hospital.com',
        password: 'password123',
        specialization: 'Psychiatry',
        departmentId: 'dept-psych',
        experienceYears: 9,
        about: 'Psychiatrist specializing in anxiety disorders, depression, substance abuse counseling, and cognitive behavioral therapy.',
        consultationFee: 850,
        avgConsultationTime: 1800,
        isAvailable: true,
      },
    }),
  ]);

  console.log(`✅ Created ${doctors.length} doctors`);

  // --- PATIENTS ---
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        id: 'pat-1', name: 'Rohit Kumar', dob: new Date('1990-05-15'), gender: 'Male', bloodGroup: 'B+', phone: '+919876543210', email: 'rohit@example.com', password: "password123",
      },
    }),
    prisma.patient.create({
      data: {
        id: 'pat-2', name: 'Ananya Gupta', dob: new Date('1985-11-22'), gender: 'Female', bloodGroup: 'A+', phone: '+919876543211', email: 'ananya@example.com', password: "password123",
      },
    }),
    prisma.patient.create({
      data: {
        id: 'pat-3', name: 'Mohammed Ali', dob: new Date('1978-03-08'), gender: 'Male', bloodGroup: 'O+', phone: '+919876543212', email: 'mohammed@example.com', password: "password123",
      },
    }),
    prisma.patient.create({
      data: {
        id: 'pat-4', name: 'Lakshmi Nair', dob: new Date('1995-07-30'), gender: 'Female', bloodGroup: 'AB+', phone: '+919876543213', email: 'lakshmi@example.com', password: "password123",
      },
    }),
    prisma.patient.create({
      data: {
        id: 'pat-5', name: 'Deepak Verma', dob: new Date('1968-12-01'), gender: 'Male', bloodGroup: 'O-', phone: '+919876543214', email: 'deepak@example.com', password: "password123", allergies: 'Penicillin, Sulfa drugs',
      },
    }),
  ]);

  console.log(`✅ Created ${patients.length} patients`);

  // --- SCHEDULES (for all doctors, Mon–Sat) ---
  const scheduleData: any[] = [];
  for (const doc of doctors) {
    for (let day = 1; day <= 6; day++) { // Mon-Sat
      scheduleData.push({
        doctorId: doc.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '13:00',
        slotDurationMins: 15,
        maxPatients: 16,
        sessionType: 'MORNING',
        modes: 'BOTH',
        isActive: true,
      });
      if (day <= 5) { // Mon-Fri evening
        scheduleData.push({
          doctorId: doc.id,
          dayOfWeek: day,
          startTime: '16:00',
          endTime: '19:00',
          slotDurationMins: 15,
          maxPatients: 12,
          sessionType: 'EVENING',
          modes: 'BOTH',
          isActive: true,
        });
      }
    }
  }
  await prisma.doctorSchedule.createMany({ data: scheduleData });
  console.log(`✅ Created ${scheduleData.length} schedule slots`);

  // --- SAMPLE APPOINTMENTS (today) ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        id: 'apt-1', patientId: 'pat-1', doctorId: 'doc-1',
        slotTime: new Date(today.getTime() + 9 * 3600000 + 30 * 60000),
        tokenNumber: 1, status: 'CONFIRMED', bookingChannel: 'WEB', consultationMode: 'IN_PERSON', paymentStatus: 'PAID',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'apt-2', patientId: 'pat-2', doctorId: 'doc-1',
        slotTime: new Date(today.getTime() + 10 * 3600000),
        tokenNumber: 2, status: 'CONFIRMED', bookingChannel: 'APP', consultationMode: 'IN_PERSON', paymentStatus: 'PAID',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'apt-3', patientId: 'pat-3', doctorId: 'doc-2',
        slotTime: new Date(today.getTime() + 10 * 3600000 + 30 * 60000),
        tokenNumber: 1, status: 'CONFIRMED', bookingChannel: 'WEB', consultationMode: 'VIDEO', paymentStatus: 'PAID',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'apt-4', patientId: 'pat-4', doctorId: 'doc-3',
        slotTime: new Date(today.getTime() + 11 * 3600000),
        tokenNumber: 1, status: 'CONFIRMED', bookingChannel: 'DESK', consultationMode: 'IN_PERSON', paymentStatus: 'PENDING',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'apt-5', patientId: 'pat-5', doctorId: 'doc-4',
        slotTime: new Date(today.getTime() + 16 * 3600000),
        tokenNumber: 1, status: 'CONFIRMED', bookingChannel: 'WEB', consultationMode: 'IN_PERSON', paymentStatus: 'PAID',
      },
    }),
  ]);
  console.log(`✅ Created ${appointments.length} appointments`);

  // --- QUEUE TOKENS (for today's appointments) ---
  await Promise.all([
    prisma.queueToken.create({
      data: { appointmentId: 'apt-1', doctorId: 'doc-1', status: 'WAITING', queuePosition: 1 },
    }),
    prisma.queueToken.create({
      data: { appointmentId: 'apt-2', doctorId: 'doc-1', status: 'WAITING', queuePosition: 2 },
    }),
    prisma.queueToken.create({
      data: { appointmentId: 'apt-3', doctorId: 'doc-2', status: 'WAITING', queuePosition: 1 },
    }),
    prisma.queueToken.create({
      data: { appointmentId: 'apt-4', doctorId: 'doc-3', status: 'WAITING', queuePosition: 1 },
    }),
    prisma.queueToken.create({
      data: { appointmentId: 'apt-5', doctorId: 'doc-4', status: 'WAITING', queuePosition: 1 },
    }),
  ]);
  console.log(`✅ Created 5 queue tokens`);

  // --- SAMPLE EMR RECORDS, PRESCRIPTIONS, LAB ORDERS ---
  const emr = await prisma.emrRecord.create({
    data: {
      patientId: 'pat-1', doctorId: 'doc-1',
      soapNotes: 'S: Patient complains of chest tightness and shortness of breath during exertion.\nO: BP 142/88, HR 82, SpO2 97%.\nA: Suspected stable angina. ECG shows mild ST depression.\nP: Start aspirin 75mg, atorvastatin 20mg. Order stress test and lipid panel.',
      icd10Code: 'I20.9',
      vitalsJson: { bp: '142/88', hr: 82, spo2: 97, temp: 98.4, weight: 78 },
    },
  });

  await prisma.prescription.create({
    data: {
      emrRecordId: emr.id,
      medicinesJson: [
        { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '30 days' },
        { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '15 days' },
      ],
      drugCheckPassed: true,
      dispatchedToPharmacy: false,
    },
  });

  await prisma.labOrder.create({
    data: {
      emrRecordId: emr.id,
      testName: 'Lipid Panel (Total Cholesterol, LDL, HDL, Triglycerides)',
      urgency: 'ROUTINE',
      status: 'PENDING',
    },
  });

  await prisma.labOrder.create({
    data: {
      emrRecordId: emr.id,
      testName: 'Cardiac Stress Test (TMT)',
      urgency: 'URGENT',
      status: 'PENDING',
    },
  });

  console.log(`✅ Created EMR record, prescription, and 2 lab orders`);

  // --- REVIEWS ---
  const reviewData = [
    { patientId: 'pat-1', doctorId: 'doc-1', appointmentId: 'apt-1', rating: 4.5, waitTime: 4, behaviour: 5, treatment: 5, recommend: true, comment: 'Very thorough examination. Explained everything clearly.' },
    { patientId: 'pat-2', doctorId: 'doc-1', appointmentId: 'apt-2', rating: 4.8, waitTime: 3, behaviour: 5, treatment: 5, recommend: true, comment: 'Excellent cardiologist. Highly recommended.' },
    { patientId: 'pat-3', doctorId: 'doc-2', appointmentId: 'apt-3', rating: 4.2, waitTime: 4, behaviour: 4, treatment: 4, recommend: true, comment: 'Good consultation. Wait time was reasonable.' },
  ];

  for (const rev of reviewData) {
    await prisma.review.create({ data: rev });
  }
  console.log(`✅ Created ${reviewData.length} reviews`);

  // --- BILLING INVOICES ---
  await prisma.billingInvoice.create({
    data: {
      patientId: 'pat-1', appointmentId: 'apt-1',
      itemsJson: [{ item: 'Consultation - Cardiology', amount: 800 }, { item: 'ECG', amount: 300 }],
      totalAmount: 1100, paymentStatus: 'PAID',
    },
  });
  await prisma.billingInvoice.create({
    data: {
      patientId: 'pat-2', appointmentId: 'apt-2',
      itemsJson: [{ item: 'Consultation - Cardiology', amount: 800 }],
      totalAmount: 800, paymentStatus: 'PAID',
    },
  });
  console.log(`✅ Created 2 billing invoices`);

  
  // --- STAFF ---
  await prisma.staff.createMany({
    data: [
      { name: 'Admin', email: 'sahisnp@gmail.com', password: 'err0r404#@Sahisnp', role: 'ADMIN' },
      { name: 'Front Desk', email: 'reception@hospital.com', password: 'password123', role: 'RECEPTIONIST' },
      { name: 'Lab Tech', email: 'lab@hospital.com', password: 'password123', role: 'LAB_TECH' },
      { name: 'Pharmacist', email: 'pharmacy@hospital.com', password: 'password123', role: 'PHARMACIST' },
    ]
  });
  console.log('✅ Created 4 staff accounts');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
