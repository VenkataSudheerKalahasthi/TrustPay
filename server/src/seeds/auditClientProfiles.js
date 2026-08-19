'use strict';

require('dotenv').config();
const { prisma } = require('../config/database');

async function auditClientProfiles() {
  console.log('===========================================================');
  console.log('🔍 AUDITING DATABASE CLIENT USERS & CLIENT PROFILES');
  console.log('===========================================================');

  const clientUsers = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: { clientProfile: true },
  });

  console.log(`Found ${clientUsers.length} users with role = 'CLIENT':`);

  let missingCount = 0;
  for (const u of clientUsers) {
    if (!u.clientProfile) {
      console.log(`❌ MISSING ClientProfile: User ID ${u.id} | Email: ${u.email} | Name: ${u.firstName} ${u.lastName}`);
      missingCount++;

      // Create missing profile
      const newProfile = await prisma.clientProfile.create({
        data: {
          userId: u.id,
          companyName: `${u.firstName} ${u.lastName} Enterprise`,
          country: 'India',
        },
      });

      // Ensure EscrowWallet exists as well
      const wallet = await prisma.escrowWallet.findUnique({ where: { clientProfileId: newProfile.id } });
      if (!wallet) {
        await prisma.escrowWallet.create({
          data: {
            clientProfileId: newProfile.id,
            availableBalance: 500000.0,
            totalBalance: 500000.0,
            currency: 'INR',
          },
        });
      }

      console.log(`   ✓ Created ClientProfile (${newProfile.id}) & EscrowWallet for ${u.email}`);
    } else {
      console.log(`✓ Valid: User ${u.email} -> ClientProfile ID ${u.clientProfile.id}`);
    }
  }

  // Check for orphan ClientProfiles
  const allProfiles = await prisma.clientProfile.findMany({
    include: { user: true },
  });

  let orphanCount = 0;
  for (const p of allProfiles) {
    if (!p.user) {
      console.log(`⚠️ ORPHANED ClientProfile ID: ${p.id}`);
      orphanCount++;
    }
  }

  console.log('\n-----------------------------------------------------------');
  console.log(`Audit Summary: Total CLIENT Users = ${clientUsers.length} | Missing Profiles Repaired = ${missingCount} | Orphaned Profiles = ${orphanCount}`);
  console.log('===========================================================');
}

auditClientProfiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
