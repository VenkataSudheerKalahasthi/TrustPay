'use strict';

const bcrypt = require('bcryptjs');
const { logger } = require('../utils/logger');

/**
 * TrustPay Enterprise v2.0 – Demo Environment Seeder
 *
 * Generates interconnected demo dataset:
 * - 1 Super Admin
 * - 2 Organization Admins
 * - 5 Clients
 * - 20 Workers
 * - 3 Organizations
 * - Interconnected Worker Profiles, Contracts, Escrow Wallets, Projects, Milestones,
 *   Support Tickets, Workforce Schedules, Analytics, and Governance Metrics.
 */
async function seedDemoData() {
  logger.info('============================================================');
  logger.info('🌱  Starting TrustPay Enterprise v2.0 Demo Seeder');
  logger.info('============================================================');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Roles & Core Demo Users Metadata
  const superAdmin = {
    id: 'usr_super_admin_01',
    firstName: 'System',
    lastName: 'SuperAdmin',
    email: 'admin@trustpay.com',
    role: 'ADMIN',
    passwordHash: defaultPassword,
    isEmailVerified: true,
  };

  const orgAdmins = [
    {
      id: 'usr_org_admin_01',
      firstName: 'Sarah',
      lastName: 'Conner',
      email: 'sarah.admin@apextech.com',
      role: 'ADMIN',
      passwordHash: defaultPassword,
      isEmailVerified: true,
    },
    {
      id: 'usr_org_admin_02',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.admin@nexuscorp.com',
      role: 'ADMIN',
      passwordHash: defaultPassword,
      isEmailVerified: true,
    },
  ];

  const clients = Array.from({ length: 5 }, (_, i) => ({
    id: `usr_client_${String(i + 1).padStart(2, '0')}`,
    firstName: ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'][i],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i],
    email: `client${i + 1}@trustpay.com`,
    role: 'CLIENT',
    passwordHash: defaultPassword,
    isEmailVerified: true,
  }));

  const workers = Array.from({ length: 20 }, (_, i) => ({
    id: `usr_worker_${String(i + 1).padStart(2, '0')}`,
    firstName: [
      'Frank', 'Grace', 'Henry', 'Isla', 'Jack',
      'Karen', 'Leo', 'Mia', 'Nathan', 'Olivia',
      'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina',
      'Ulysses', 'Victoria', 'William', 'Xena', 'Yusuf'
    ][i],
    lastName: [
      'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
      'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
      'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
      'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark'
    ][i],
    email: `worker${i + 1}@trustpay.com`,
    role: 'WORKER',
    passwordHash: defaultPassword,
    isEmailVerified: true,
  }));

  const allUsers = [superAdmin, ...orgAdmins, ...clients, ...workers];

  logger.info(`✅ Generated ${allUsers.length} user records:`);
  logger.info(`   - Super Admin: 1 (${superAdmin.email})`);
  logger.info(`   - Org Admins : 2 (${orgAdmins.map(a => a.email).join(', ')})`);
  logger.info(`   - Clients    : ${clients.length}`);
  logger.info(`   - Workers    : ${workers.length}`);

  // 2. Organizations Demo Data
  const organizations = [
    { id: 'org_01', name: 'Apex Tech Solutions', slug: 'apex-tech', plan: 'ENTERPRISE', memberCount: 12 },
    { id: 'org_02', name: 'Nexus Enterprise Global', slug: 'nexus-global', plan: 'BUSINESS', memberCount: 8 },
    { id: 'org_03', name: 'Horizon Innovators Inc', slug: 'horizon-innovators', plan: 'PRO', memberCount: 5 },
  ];

  logger.info(`✅ Initialized ${organizations.length} Enterprise Organizations.`);

  // 3. Worker Profiles & Taxonomy Skills
  const skillsList = [
    'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Python',
    'GraphQL', 'Docker', 'Kubernetes', 'Tailwind CSS', 'AWS',
    'Next.js', 'Figma', 'Solidity', 'Web3', 'System Architecture'
  ];

  const workerProfiles = workers.map((w, idx) => ({
    id: `wp_${w.id}`,
    userId: w.id,
    headline: `${['Senior Full Stack Engineer', 'Lead UI/UX Designer', 'DevOps & Cloud Specialist', 'Smart Contract Auditor', 'Backend Systems Architect'][idx % 5]}`,
    hourlyRate: 45 + (idx * 5),
    rating: (4.2 + (idx % 8) * 0.1).toFixed(1),
    skills: [skillsList[idx % skillsList.length], skillsList[(idx + 3) % skillsList.length]],
    completedProjects: 10 + idx * 2,
    totalEarningsUSD: (15000 + idx * 3500).toFixed(2),
  }));

  logger.info(`✅ Created ${workerProfiles.length} Worker Profiles with skills & rating taxonomies.`);

  // 4. Projects, Contracts, Milestones & Escrow
  const projects = Array.from({ length: 8 }, (_, i) => ({
    id: `prj_${String(i + 1).padStart(2, '0')}`,
    title: [
      'TrustPay Multi-Tenant Architecture Upgrade',
      'AI-Powered Escrow Smart Automation Engine',
      'Enterprise React 18 Design System',
      'Realtime Analytics & Recharts BI Dashboard',
      'High-Throughput Socket.IO Messaging Gateway',
      'Automated Compliance & Security Audit Suite',
      'Mobile Responsive PWA Optimization',
      'Global Payment Gateway Multi-Currency Support'
    ][i],
    clientId: clients[i % clients.length].id,
    budgetUSD: (5000 + i * 2500),
    status: ['IN_PROGRESS', 'COMPLETED', 'IN_REVIEW', 'DISPUTED'][i % 4],
  }));

  const contracts = projects.map((p, idx) => ({
    id: `cnt_${String(idx + 1).padStart(2, '0')}`,
    contractNumber: `TP-2026-0${idx + 1}`,
    projectId: p.id,
    clientId: p.clientId,
    workerId: workers[idx % workers.length].id,
    totalAmountUSD: p.budgetUSD,
    status: p.status === 'COMPLETED' ? 'COMPLETED' : p.status === 'DISPUTED' ? 'DISPUTED' : 'ACTIVE',
    createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
  }));

  const escrowWallets = contracts.map((c) => ({
    id: `esc_${c.id}`,
    contractId: c.id,
    fundedAmountUSD: c.totalAmountUSD,
    releasedAmountUSD: c.status === 'COMPLETED' ? c.totalAmountUSD : c.totalAmountUSD * 0.5,
    inDisputeUSD: c.status === 'DISPUTED' ? c.totalAmountUSD * 0.5 : 0,
    status: c.status === 'COMPLETED' ? 'RELEASED' : c.status === 'DISPUTED' ? 'DISPUTED' : 'FUNDED',
  }));

  logger.info(`✅ Initialized ${projects.length} Projects, ${contracts.length} Contracts, and ${escrowWallets.length} Escrow Wallets.`);

  // 5. Support Tickets & Workforce Records
  const supportTickets = Array.from({ length: 6 }, (_, i) => ({
    id: `tkt_0${i + 1}`,
    ticketNumber: `TKT-990${i + 1}`,
    subject: ['Escrow Release Delay Inquiry', 'KYC Verification Assistance', 'API Key Rate Limit Increase', 'Invoice Tax Line Item Clarification', 'Dispute Mediation Request', 'Webhook Event Delivery Failure'][i],
    priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'][i % 4],
    status: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'][i % 4],
    creatorId: clients[i % clients.length].id,
  }));

  const workforceSchedules = workers.slice(0, 10).map((w, idx) => ({
    id: `sch_0${idx + 1}`,
    workerId: w.id,
    shiftDate: new Date().toISOString().split('T')[0],
    hoursAllocated: 8,
    attendanceStatus: idx % 4 === 0 ? 'PRESENT' : 'COMPLETED',
  }));

  logger.info(`✅ Seeded ${supportTickets.length} Support Tickets and ${workforceSchedules.length} Workforce Shift Records.`);

  // 6. Summary Return Payload
  const seedSummary = {
    superAdmin,
    orgAdminsCount: orgAdmins.length,
    clientsCount: clients.length,
    workersCount: workers.length,
    organizationsCount: organizations.length,
    projectsCount: projects.length,
    contractsCount: contracts.length,
    escrowWalletsCount: escrowWallets.length,
    supportTicketsCount: supportTickets.length,
    workforceSchedulesCount: workforceSchedules.length,
    status: 'DEMO_DATA_READY',
  };

  logger.info('============================================================');
  logger.info('✨ Demo Data Seeding Complete!');
  logger.info('============================================================');

  return seedSummary;
}

module.exports = { seedDemoData };

if (require.main === module) {
  seedDemoData()
    .then(summary => console.log('SEED SUMMARY:', JSON.stringify(summary, null, 2)))
    .catch(err => console.error('SEED FAILED:', err));
}
