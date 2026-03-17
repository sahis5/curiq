const fs = require('fs');

let content = fs.readFileSync('prisma/seed.ts', 'utf8');

// Add password to all patients
content = content.replace(/(id: 'pat-\d+',[^}]+email: '[^']+',)/g, '$1 password: "password123",');

// Add email and password to doctors
let docEmailCounter = 1;
content = content.replace(/name: '([^']+)',/g, (match, name) => {
    // Only apply to Dr. names
    if (name.startsWith('Dr.')) {
        const email = name.toLowerCase().replace(/[^a-z]/g, '') + '@hospital.com';
        return `${match}\n        email: '${email}',\n        password: 'password123',`;
    }
    return match;
});

// Append Staff creation at the end just before "console.log('\n🎉 Database seeded successfully!');"
const staffSeedCode = `
  // --- STAFF ---
  await prisma.staff.createMany({
    data: [
      { name: 'Admin User', email: 'admin@hospital.com', password: 'password123', role: 'ADMIN' },
      { name: 'Front Desk', email: 'reception@hospital.com', password: 'password123', role: 'RECEPTIONIST' },
      { name: 'Lab Tech', email: 'lab@hospital.com', password: 'password123', role: 'LAB_TECH' },
      { name: 'Pharmacist', email: 'pharmacy@hospital.com', password: 'password123', role: 'PHARMACIST' },
    ]
  });
  console.log('✅ Created 4 staff accounts');
`;

content = content.replace("console.log('\\n🎉 Database seeded successfully!');", staffSeedCode + "\n  console.log('\\n🎉 Database seeded successfully!');");

// Also add 'await prisma.staff.deleteMany();' at the top of the file
content = content.replace("await prisma.review.deleteMany();", "await prisma.staff.deleteMany();\n  await prisma.review.deleteMany();");

fs.writeFileSync('prisma/seed.ts', content);
console.log('seed.ts updated successfully');
