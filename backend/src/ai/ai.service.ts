import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async generateRecommendations(patientId: string) {
    // 1. Fetch latest EMR and Prescriptions
    const history = await this.prisma.emrRecord.findMany({
      where: { patientId },
      orderBy: { visitDate: 'desc' },
      take: 1,
      include: {
        prescriptions: true,
      }
    });

    if (!history.length) {
      return {
        diet: ["Maintain a balanced diet rich in vegetables, lean proteins, and whole grains.", "Stay hydrated with 2-3 liters of water daily."],
        workout: ["Engage in at least 30 minutes of moderate cardiovascular exercise daily, such as brisk walking.", "Include stretching and flexibility work."],
        notes: "No recent medical history found to provide specific personalized recommendations."
      };
    }

    const latest = history[0];
    const vitals = latest.vitalsJson as any || {};
    // Parse BP from "142/88" format if stored that way
    let bpSystolic = vitals.bpSystolic || 0;
    let bpDiastolic = vitals.bpDiastolic || 0;
    if (vitals.bp && typeof vitals.bp === 'string' && vitals.bp.includes('/')) {
      const parts = vitals.bp.split('/');
      bpSystolic = parseInt(parts[0]) || 0;
      bpDiastolic = parseInt(parts[1]) || 0;
    }
    const heartRate = vitals.heartRate || vitals.hr || 0;
    const temperature = vitals.temperature || vitals.temp || 0;
    const bmi = vitals.bmi || 0;
    const prescriptions = latest.prescriptions.flatMap(p => (p.medicinesJson as any[]).map(m => m.name.toLowerCase()));
    const diseaseCode = latest.icd10Code || '';
    const notes = latest.soapNotes?.toLowerCase() || '';

    let diet = [];
    let workout = [];
    let summary = [];

    // --- DIET LOGIC ---
    if (bpSystolic > 130 || prescriptions.includes('lisinopril') || notes.includes('hypertension')) {
      diet.push("Low sodium (DASH diet) - avoid processed foods, canned soups, and excess salt.");
      diet.push("Increase potassium intake through bananas, spinach, and sweet potatoes.");
    }
    if (prescriptions.includes('metformin') || diseaseCode.includes('E11')) {
      diet.push("Low glycemic index foods - focus on complex carbohydrates, avoid sugary drinks and refined grains.");
      diet.push("Increase high-fiber foods to stabilize blood sugar levels.");
    }
    if (bmi > 25 || notes.includes('obesity')) {
      diet.push("Caloric deficit recommended. Prioritize high-protein, high-satiety meals.");
    }

    if (diet.length === 0) {
      diet.push("Maintain a balanced, nutrient-dense diet.");
      diet.push("Ensure adequate hydration (2-3 liters of water daily).");
    }

    // --- WORKOUT LOGIC ---
    if (notes.includes('arthritis') || notes.includes('joint pain')) {
      workout.push("Low-impact exercises: Swimming, water aerobics, or stationary cycling to protect joints.");
      workout.push("Gentle stretching and yoga for flexibility.");
    } else if (bpSystolic > 140) {
      workout.push("Moderate aerobic exercise (brisk walking, light cycling). Avoid heavy weightlifting or high-intensity interval training (HIIT) that severely spikes heart rate.");
    } else {
      workout.push("Mix of cardiovascular training (150 mins/week) and resistance training (2 days/week).");
      workout.push("Incorporate daily mobility work and stretching.");
    }

    summary.push(`Recommendations generated based on your latest visit on ${new Date(latest.visitDate).toLocaleDateString()}.`);
    if (prescriptions.length > 0) {
      summary.push(`Dietary plans have been adjusted to complement your current prescriptions. *Note: We do not prescribe or alter medications here. Consult your doctor for medication management.*`);
    }

    return {
      diet,
      workout,
      notes: summary.join(' ')
    };
  }
}
