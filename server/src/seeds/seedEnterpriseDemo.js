'use strict';

require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('../config/database');

/**
 * TrustPay Enterprise v2.0 – Production Seeder
 * Populates exact 4 Clients, 5 Workers (with exact roles), Funded Wallets,
 * Marketplace Profiles, Contracts, Workspaces, Planning Boards, Chat Messages,
 * File Attachments, Escrow Releases, Invoices, Receipts, Certificates, and Audit Logs.
 */
async function seedEnterpriseDemoData() {
  console.log('===========================================================');
  console.log('🌱  TrustPay Enterprise v2.0 – Enterprise Demo Seeder');
  console.log('===========================================================');

  try {
    const commonPassword = await bcrypt.hash('TrustPay@2026', 10);

    // ─── 1. CLIENT ACCOUNTS (4) ───────────────────────────────────────────────
    const clientData = [
      {
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+919876543210',
        companyName: 'Sharma FinTech Global Ltd',
        industry: 'Banking & Financial Technology',
        city: 'Mumbai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        balance: 500000.0,
      },
      {
        firstName: 'Priya',
        lastName: 'Reddy',
        email: 'priya.reddy@gmail.com',
        phone: '+919876543211',
        companyName: 'Reddy Infra & Real Estate',
        industry: 'Commercial & Residential Infrastructure',
        city: 'Hyderabad',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        balance: 750000.0,
      },
      {
        firstName: 'Arjun',
        lastName: 'Mehta',
        email: 'arjun.mehta@gmail.com',
        phone: '+919876543212',
        companyName: 'Mehta Ventures & Cloud Capital',
        industry: 'Enterprise Software & Venture Capital',
        city: 'Bengaluru',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        balance: 1000000.0,
      },
      {
        firstName: 'Sneha',
        lastName: 'Kapoor',
        email: 'sneha.kapoor@gmail.com',
        phone: '+919876543213',
        companyName: 'Kapoor Luxury Living & Interiors',
        industry: 'Interior Design & Architecture',
        city: 'Delhi NCR',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
        balance: 600000.0,
      },
    ];

    const clientUsers = [];
    const clientProfiles = [];

    for (const c of clientData) {
      const user = await prisma.user.upsert({
        where: { email: c.email },
        update: { passwordHash: commonPassword, phone: c.phone, avatar: c.avatar },
        create: {
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          passwordHash: commonPassword,
          role: 'CLIENT',
          avatar: c.avatar,
          isEmailVerified: true,
        },
      });

      const profile = await prisma.clientProfile.upsert({
        where: { userId: user.id },
        update: { companyName: c.companyName, industry: c.industry, city: c.city },
        create: {
          userId: user.id,
          companyName: c.companyName,
          companyType: 'ENTERPRISE',
          industry: c.industry,
          city: c.city,
          country: 'India',
        },
      });

      await prisma.escrowWallet.upsert({
        where: { clientProfileId: profile.id },
        update: { availableBalance: c.balance, totalBalance: c.balance },
        create: {
          clientProfileId: profile.id,
          availableBalance: c.balance,
          totalBalance: c.balance,
          currency: 'INR',
        },
      });

      clientUsers.push(user);
      clientProfiles.push(profile);
      console.log(`  ✓ Client Seeded: ${user.firstName} ${user.lastName} (${user.email}) | Wallet: ₹${c.balance}`);
    }

    // ─── 2. WORKER ACCOUNTS (5 Exact Roles) ──────────────────────────────────
    const workerData = [
      {
        firstName: 'Karthik',
        lastName: 'Varma',
        email: 'karthik.freelancer@gmail.com',
        roleTitle: 'Freelancer',
        slug: 'karthik-varma-freelancer',
        title: 'Senior Full-Stack & Smart Contract Specialist',
        bio: 'Expert freelance developer specializing in React, Node.js, Next.js, and Escrow Smart Contracts.',
        hourlyRate: 1800,
        yearsExp: 7,
        city: 'Bengaluru',
        skills: ['React', 'Node.js', 'Next.js', 'Solidity', 'Escrow Architecture', 'TypeScript'],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      },
      {
        firstName: 'Rohit',
        lastName: 'Desai',
        email: 'rohit.architect@gmail.com',
        roleTitle: 'House Architect / House Designer',
        slug: 'rohit-desai-architect',
        title: 'Principal House Architect & 3D Interior Designer',
        bio: 'Licensed structural architect and villa designer creating modern eco-friendly luxury homes.',
        hourlyRate: 2500,
        yearsExp: 10,
        city: 'Mumbai',
        skills: ['Architectural Design', 'AutoCAD', '3D Elevation', 'Structural Engineering', 'BIM Modelling'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      },
      {
        firstName: 'Manoj',
        lastName: 'Kumar',
        email: 'manoj.painter@gmail.com',
        roleTitle: 'Painter',
        slug: 'manoj-kumar-painter',
        title: 'Master Interior & Exterior Painter',
        bio: 'Professional painter providing high-end texture coating, waterproofing, and luxury interior finishes.',
        hourlyRate: 850,
        yearsExp: 8,
        city: 'Delhi NCR',
        skills: ['Texture Painting', 'Waterproofing', 'Stencil Art', 'Exterior Coating', 'Wall Decor'],
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
      },
      {
        firstName: 'Vikram',
        lastName: 'Naidu',
        email: 'vikram.carpenter@gmail.com',
        roleTitle: 'Carpenter',
        slug: 'vikram-naidu-carpenter',
        title: 'Craftsman & Modular Furniture Specialist',
        bio: 'Custom woodworking master specializing in modular kitchens, wardrobes, and solid teak furniture.',
        hourlyRate: 1200,
        yearsExp: 12,
        city: 'Hyderabad',
        skills: ['Modular Kitchens', 'Custom Woodwork', 'Teak Furniture', 'Veneer Polishing', 'Wardrobes'],
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
      },
      {
        firstName: 'Suresh',
        lastName: 'Yadav',
        email: 'suresh.plumber@gmail.com',
        roleTitle: 'Plumber',
        slug: 'suresh-yadav-plumber',
        title: 'Certified Master Plumbing Engineer',
        bio: 'Commercial and residential plumbing specialist for concealed piping, pressure pumps, and luxury bath fittings.',
        hourlyRate: 950,
        yearsExp: 9,
        city: 'Chennai',
        skills: ['Pipeline Fitting', 'Pressure Pumps', 'Leak Detection', 'Bath Fitting', 'Solar Heater Piping'],
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
      },
    ];

    const workerUsers = [];
    const workerProfiles = [];

    for (const w of workerData) {
      const user = await prisma.user.upsert({
        where: { email: w.email },
        update: { passwordHash: commonPassword, avatar: w.avatar },
        create: {
          firstName: w.firstName,
          lastName: w.lastName,
          email: w.email,
          passwordHash: commonPassword,
          role: 'WORKER',
          avatar: w.avatar,
          isEmailVerified: true,
        },
      });

      const profile = await prisma.workerProfile.upsert({
        where: { userId: user.id },
        update: {
          title: w.title,
          bio: w.bio,
          hourlyRate: w.hourlyRate,
          yearsExperience: w.yearsExp,
          city: w.city,
          country: 'India',
          verificationStatus: 'VERIFIED',
        },
        create: {
          userId: user.id,
          slug: w.slug,
          title: w.title,
          bio: w.bio,
          hourlyRate: w.hourlyRate,
          availabilityStatus: 'AVAILABLE',
          yearsExperience: w.yearsExp,
          city: w.city,
          country: 'India',
          verificationStatus: 'VERIFIED',
        },
      });

      // Populate Portfolio Projects
      await prisma.portfolioProject.deleteMany({ where: { workerProfileId: profile.id } });
      await prisma.portfolioProject.create({
        data: {
          workerProfileId: profile.id,
          title: `Featured Showcase - ${w.roleTitle}`,
          description: `High quality production showcase executed for enterprise clients in ${w.city}.`,
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
          ],
        },
      });

      workerUsers.push(user);
      workerProfiles.push(profile);
      console.log(`  ✓ Worker Seeded: ${w.firstName} ${w.lastName} (${w.roleTitle}) | Email: ${w.email}`);
    }

    // ─── 3. INTERCONNECTED WORKSPACES, CONTRACTS, & ESCROW RELEASE ───────────
    console.log('\n--- Seeding Collaboration Workspaces & Escrow Records ---');

    // Clean up prior demo workspaces & requests for idempotency
    await prisma.completionCertificate.deleteMany({ where: { certificateNumber: { in: ['CERT-2026-000101', 'CERT-2026-000102'] } } }).catch(() => {});
    await prisma.invoice.deleteMany({ where: { invoiceNumber: { in: ['INV-2026-000101', 'INV-2026-000102'] } } }).catch(() => {});
    await prisma.contractSignature.deleteMany({ where: { contract: { contractNumber: { in: ['TP-2026-000101', 'TP-2026-000102'] } } } }).catch(() => {});
    await prisma.planningBoard.deleteMany({ where: { workspace: { workspaceNumber: { in: ['WS-2026-000101', 'WS-2026-000102'] } } } }).catch(() => {});
    await prisma.collaborationWorkspace.deleteMany({ where: { workspaceNumber: { in: ['WS-2026-000101', 'WS-2026-000102'] } } }).catch(() => {});
    await prisma.contract.deleteMany({ where: { contractNumber: { in: ['TP-2026-000101', 'TP-2026-000102'] } } }).catch(() => {});
    await prisma.collaborationRequest.deleteMany({ where: { requestNumber: { in: ['REQ-2026-000101', 'REQ-2026-000102'] } } }).catch(() => {});
    await prisma.conversationParticipant.deleteMany({ where: { conversation: { conversationNumber: { in: ['CONV-2026-000101', 'CONV-2026-000102'] } } } }).catch(() => {});
    await prisma.message.deleteMany({ where: { conversation: { conversationNumber: { in: ['CONV-2026-000101', 'CONV-2026-000102'] } } } }).catch(() => {});
    await prisma.conversation.deleteMany({ where: { conversationNumber: { in: ['CONV-2026-000101', 'CONV-2026-000102'] } } }).catch(() => {});

    // Workspace 1: Rahul Sharma (Client) ↔ Karthik Varma (Freelancer)
    const client1 = clientProfiles[0];
    const worker1 = workerProfiles[0];

    const req1 = await prisma.collaborationRequest.create({
      data: {
        requestNumber: 'REQ-2026-000101',
        clientProfileId: client1.id,
        workerProfileId: worker1.id,
        projectTitle: 'TrustPay Enterprise Escrow Mobile PWA Integration',
        projectDescription: 'Develop responsive mobile PWA components with instant wallet sync and electronic signature canvas.',
        budget: 120000,
        estimatedDuration: '3 Weeks',
        status: 'ACCEPTED',
      },
    });

    const conv1 = await prisma.conversation.create({
      data: {
        conversationNumber: 'CONV-2026-000101',
        type: 'DIRECT',
        title: 'Chat: TrustPay Enterprise Escrow PWA',
        createdById: clientUsers[0].id,
        participants: {
          create: [
            { userId: clientUsers[0].id, role: 'OWNER' },
            { userId: workerUsers[0].id, role: 'MEMBER' },
          ],
        },
        messages: {
          create: [
            {
              senderUserId: clientUsers[0].id,
              content: 'Hi Karthik! We loved your profile. Could you review the project scope and initial wireframes?',
            },
            {
              senderUserId: workerUsers[0].id,
              content: 'Hello Rahul! I reviewed the requirements. The timeline and ₹1,20,000 budget look good.',
            },
            {
              senderUserId: workerUsers[0].id,
              content: 'Here is the technical specification document for your review: https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
            },
          ],
        },
      },
    });

    const ws1 = await prisma.collaborationWorkspace.create({
      data: {
        workspaceNumber: 'WS-2026-000101',
        requestId: req1.id,
        clientProfileId: client1.id,
        workerProfileId: worker1.id,
        conversationId: conv1.id,
        escrowWalletId: (await prisma.escrowWallet.findUnique({ where: { clientProfileId: client1.id } })).id,
        status: 'CONTRACT_LOCKED',
        planningBoard: {
          create: {
            scope: 'Enterprise mobile PWA with real-time web socket sync, e-signatures, and instant wallet release.',
            budget: 120000,
            timeline: '3 Weeks',
            revisionPolicy: 'Standard 2 revisions per milestone',
            clientAgreed: true,
            workerAgreed: true,
            agreedAt: new Date(),
          },
        },
      },
    });

    const contract1 = await prisma.contract.create({
      data: {
        contractNumber: 'TP-2026-000101',
        clientProfileId: client1.id,
        workerProfileId: worker1.id,
        title: 'TrustPay Mobile PWA Development Contract',
        scopeOfWork: 'Complete frontend PWA & Socket.io integration.',
        deliverables: 'PWA codebase, test suites, documentation.',
        termsAndConditions: 'TrustPay Standard Escrow Terms.',
        paymentTermsText: '₹1,20,000 held in Escrow until final approval.',
        status: 'ACCEPTED',
        escrowState: 'FUNDED',
        collaborationWorkspace: { connect: { id: ws1.id } },
        signatures: {
          create: [
            { signerUserId: clientUsers[0].id, signerRole: 'CLIENT', signatureStatus: 'SIGNED', signatureTimestamp: new Date(), signatureHash: crypto.randomBytes(16).toString('hex') },
            { signerUserId: workerUsers[0].id, signerRole: 'WORKER', signatureStatus: 'SIGNED', signatureTimestamp: new Date(), signatureHash: crypto.randomBytes(16).toString('hex') },
          ],
        },
      },
    });

    await prisma.collaborationWorkspace.update({
      where: { id: ws1.id },
      data: { contractId: contract1.id, status: 'FUNDED' },
    });

    console.log(`  ✓ Workspace 1 Seeded: Rahul Sharma ↔ Karthik Varma (Contract: ${contract1.contractNumber})`);

    // Workspace 2: Priya Reddy (Client) ↔ Rohit Desai (Architect) [COMPLETED WITH ESCROW RELEASE]
    const client2 = clientProfiles[1];
    const worker2 = workerProfiles[1];

    const req2 = await prisma.collaborationRequest.create({
      data: {
        requestNumber: 'REQ-2026-000102',
        clientProfileId: client2.id,
        workerProfileId: worker2.id,
        projectTitle: 'Modern Luxury Villa Architectural Blueprint & 3D Elevation',
        projectDescription: 'Complete structural drawing, 3D interior renders, and floor plan blueprint.',
        budget: 250000,
        estimatedDuration: '4 Weeks',
        status: 'ACCEPTED',
      },
    });

    const ws2 = await prisma.collaborationWorkspace.create({
      data: {
        workspaceNumber: 'WS-2026-000102',
        requestId: req2.id,
        clientProfileId: client2.id,
        workerProfileId: worker2.id,
        escrowWalletId: (await prisma.escrowWallet.findUnique({ where: { clientProfileId: client2.id } })).id,
        status: 'COMPLETED',
        planningBoard: {
          create: {
            scope: '3D Villa architectural design, structural calculations, and permit drawings.',
            budget: 250000,
            timeline: '4 Weeks',
            clientAgreed: true,
            workerAgreed: true,
            agreedAt: new Date(Date.now() - 15 * 86400000),
          },
        },
      },
    });

    const contract2 = await prisma.contract.create({
      data: {
        contractNumber: 'TP-2026-000102',
        clientProfileId: client2.id,
        workerProfileId: worker2.id,
        title: 'Architectural Blueprint & Design Agreement',
        scopeOfWork: 'Villa architectural floor plans & 3D elevation renders.',
        deliverables: 'CAD files, high-res PDF blueprints, rendering assets.',
        termsAndConditions: 'TrustPay Enterprise Escrow Standard.',
        paymentTermsText: '₹2,50,000 released upon client final sign-off.',
        status: 'ACCEPTED',
        escrowState: 'RELEASED',
        acceptedAt: new Date(Date.now() - 10 * 86400000),
        collaborationWorkspace: { connect: { id: ws2.id } },
        signatures: {
          create: [
            { signerUserId: clientUsers[1].id, signerRole: 'CLIENT', signatureStatus: 'SIGNED', signatureTimestamp: new Date(Date.now() - 14 * 86400000), signatureHash: crypto.randomBytes(16).toString('hex') },
            { signerUserId: workerUsers[1].id, signerRole: 'WORKER', signatureStatus: 'SIGNED', signatureTimestamp: new Date(Date.now() - 14 * 86400000), signatureHash: crypto.randomBytes(16).toString('hex') },
          ],
        },
      },
    });

    const wallet2 = await prisma.escrowWallet.findUnique({ where: { clientProfileId: client2.id } });
    const release2 = await prisma.escrowRelease.create({
      data: {
        escrowWalletId: wallet2.id,
        contractId: contract2.id,
        workerProfileId: worker2.id,
        amount: 250000,
        currency: 'INR',
        releaseType: 'FULL',
        notes: 'Final delivery approved for Villa Architectural Blueprint.',
        releasedByUserId: clientUsers[1].id,
      },
    });

    const inv2 = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2026-000102',
        contractId: contract2.id,
        escrowWalletId: wallet2.id,
        clientProfileId: client2.id,
        workerProfileId: worker2.id,
        amount: 250000,
        totalAmount: 250000,
        currency: 'INR',
        paymentDetailsText: 'Paid via TrustPay Escrow Release',
      },
    });

    const cert2 = await prisma.completionCertificate.create({
      data: {
        certificateNumber: 'CERT-2026-000102',
        workspaceId: ws2.id,
        projectId: null,
        contractId: contract2.id,
        clientProfileId: client2.id,
        workerProfileId: worker2.id,
        projectTitle: 'Modern Luxury Villa Architectural Blueprint',
        clientName: `${clientUsers[1].firstName} ${clientUsers[1].lastName}`,
        workerName: `${workerUsers[1].firstName} ${workerUsers[1].lastName}`,
        budget: 250000,
        completedAt: new Date(Date.now() - 2 * 86400000),
        verificationHash: crypto.createHash('sha256').update(`cert-${ws2.id}-${release2.id}`).digest('hex'),
      },
    });

    await prisma.collaborationWorkspace.update({
      where: { id: ws2.id },
      data: { contractId: contract2.id },
    });

    console.log(`  ✓ Workspace 2 Seeded: Priya Reddy ↔ Rohit Desai (Completed | Invoice: ${inv2.invoiceNumber} | Cert: ${cert2.certificateNumber})`);

    // ─── 4. NOTIFICATIONS & AUDIT LOGS ────────────────────────────────────────
    console.log('\n--- Seeding System Notifications & Audit Logs ---');
    for (const u of [...clientUsers, ...workerUsers]) {
      await prisma.notification.create({
        data: {
          userId: u.id,
          category: 'SYSTEM',
          priority: 'NORMAL',
          title: 'Welcome to TrustPay Enterprise v2.0',
          message: `Hello ${u.firstName}! Your verified enterprise account is active and ready for collaborative workflows.`,
        },
      });
    }

    console.log('\n===========================================================');
    console.log('✨ ENTERPRISE DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ Enterprise Seeding Failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedEnterpriseDemoData().then(() => process.exit(0));
}

module.exports = { seedEnterpriseDemoData };
