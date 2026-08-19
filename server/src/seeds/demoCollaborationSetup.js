'use strict';

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const collaborationService = require('../modules/collaboration/collaboration.service');

async function runDemoCollaborationSetup() {
  console.log('===========================================================');
  console.log('TrustPay Enterprise v2.0 – E2E Collaboration & Escrow Verification');
  console.log('===========================================================');

  try {
    const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

    // Debug available models on Prisma instance
    console.log('Available Prisma models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));

    // 1. Create or Find Demo Client User & Profile
    const clientUser = await prisma.user.upsert({
      where: { email: 'demo.client@trustpay.com' },
      update: {},
      create: {
        firstName: 'Demo',
        lastName: 'Client',
        email: 'demo.client@trustpay.com',
        passwordHash,
        role: 'CLIENT',
        isEmailVerified: true,
      },
    });

    const clientProfile = await prisma.clientProfile.upsert({
      where: { userId: clientUser.id },
      update: {},
      create: {
        userId: clientUser.id,
        companyName: 'TrustPay Enterprise Global Inc.',
        companyType: 'Enterprise',
        industry: 'Financial Technology',
      },
    });

    // Ensure Client Wallet has balance
    await prisma.escrowWallet.upsert({
      where: { clientProfileId: clientProfile.id },
      update: { availableBalance: 250000.0, totalBalance: 250000.0 },
      create: {
        clientProfileId: clientProfile.id,
        availableBalance: 250000.0,
        totalBalance: 250000.0,
      },
    });

    console.log('✓ Demo Client Created & Wallet Funded (₹2,50,000)');

    // 2. Create or Find Demo Worker User & Profile
    const workerUser = await prisma.user.upsert({
      where: { email: 'demo.worker@trustpay.com' },
      update: {},
      create: {
        firstName: 'Alex',
        lastName: 'Specialist',
        email: 'demo.worker@trustpay.com',
        passwordHash,
        role: 'WORKER',
        isEmailVerified: true,
      },
    });

    const workerProfile = await prisma.workerProfile.upsert({
      where: { userId: workerUser.id },
      update: {},
      create: {
        userId: workerUser.id,
        slug: 'alex-specialist-demo',
        title: 'Lead Full-Stack & Smart Contract Architect',
        bio: 'Senior engineer specializing in enterprise security and escrow solutions.',
        hourlyRate: 1500,
        availabilityStatus: 'AVAILABLE',
        yearsExperience: 8,
        city: 'Bengaluru',
        country: 'India',
        verificationStatus: 'VERIFIED',
      },
    });

    console.log('✓ Demo Worker Created & Verified');

    // 3. Step 1 & Step 2: Client sends Collaboration Request
    console.log('\n--- Step 1 & 2: Creating Collaboration Request ---');
    const request = await collaborationService.requestCollaboration(clientUser.id, {
      workerProfileId: workerProfile.id,
      projectTitle: 'TrustPay Enterprise Escrow Core Engine',
      projectDescription: 'Build high-throughput escrow release workflows with real-time websocket synchronization and automated audit logging.',
      budget: 75000,
      estimatedDuration: '2 Weeks',
      expectedStartDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      additionalNotes: 'Requires complete unit testing and automated PDF verification.',
    });
    console.log(`✓ Collaboration Request Created: ${request.requestNumber} (ID: ${request.id})`);

    // 4. Step 3 & Step 4: Worker Accepts Request -> Workspace Created
    console.log('\n--- Step 3 & 4: Worker Accepts Request ---');
    const workspace = await collaborationService.respondToRequest(workerUser.id, request.id, {
      action: 'ACCEPT',
    });
    console.log(`✓ Collaboration Workspace Created: ${workspace.workspaceNumber} (ID: ${workspace.id})`);
    console.log(`✓ Private Conversation Room Created: ID ${workspace.conversationId}`);

    // 5. Step 6: Planning Board Real-Time Synchronization & Agreement
    console.log('\n--- Step 6: Project Planning Board Collaborative Agreement ---');
    let updatedWs = await collaborationService.updatePlanningBoard(clientUser.id, workspace.id, {
      agree: true,
      scope: 'Refined scope: TrustPay Enterprise Escrow Core Engine with automated certificates.',
      budget: 75000,
      revisionPolicy: 'Unlimited minor revisions during milestone execution.',
    });
    updatedWs = await collaborationService.updatePlanningBoard(workerUser.id, workspace.id, {
      agree: true,
    });
    console.log('✓ Client & Worker Agreed to Planning Board!');
    console.log(`✓ Enterprise Digital Contract Generated: ${updatedWs.contract?.contractNumber}`);

    // 6. Step 7 & 8: Electronic Signature & Contract Locking
    console.log('\n--- Step 7 & 8: Electronic Signature & Locking Contract ---');
    await collaborationService.signContract(clientUser.id, workspace.id, {
      signatureType: 'TYPE',
      signatureData: 'Demo Client Legal Officer',
    });
    updatedWs = await collaborationService.signContract(workerUser.id, workspace.id, {
      signatureType: 'TYPE',
      signatureData: 'Alex Specialist',
    });
    console.log(`✓ Both parties signed contract! Status: ${updatedWs.contract?.status} (Workspace: ${updatedWs.status})`);

    // 7. Step 9: Escrow Funding
    console.log('\n--- Step 9: Escrow Funding ---');
    updatedWs = await collaborationService.fundEscrow(clientUser.id, workspace.id, { amount: 75000 });
    console.log(`✓ Client funded Escrow! Workspace Status: ${updatedWs.status}`);

    // 8. Step 10: Project Execution & Deliverable Submission
    console.log('\n--- Step 10: Execution & Progress Updates ---');
    updatedWs = await collaborationService.updateExecutionProgress(workerUser.id, workspace.id, {
      status: 'IN_REVIEW',
      notes: 'Completed all core engine tasks and passed automated test suites.',
    });
    console.log('✓ Worker submitted execution progress & milestone deliverables.');

    // 9. Step 11 & 12: Client Approval, Escrow Release, Invoice & Certificate
    console.log('\n--- Step 11 & 12: Final Approval, Escrow Release & Certificates ---');
    const result = await collaborationService.approveFinalDelivery(clientUser.id, workspace.id);
    console.log(`✓ Final delivery approved! Workspace Status: ${result.workspace.status}`);
    console.log(`✓ Escrow Released! Amount: ₹${result.release.amount}`);
    console.log(`✓ Invoice Generated: ${result.invoice.invoiceNumber}`);
    console.log(`✓ Completion Certificate Generated: ${result.certificate.certificateNumber}`);
    console.log(`✓ Verification Hash: ${result.certificate.verificationHash}`);

    console.log('\n===========================================================');
    console.log('✅ ALL 12 STEPS OF E2E COLLABORATION WORKFLOW PASSED SUCCESSFULLY!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ E2E Verification Failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runDemoCollaborationSetup().then(() => process.exit(0));
}

module.exports = { runDemoCollaborationSetup };
