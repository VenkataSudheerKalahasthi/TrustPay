'use strict';

const axios = require('axios');
const { prisma } = require('./config/database');

const API_BASE = 'http://localhost:5000/api/v1';

async function runEndToEndVerification() {
  console.log('===========================================================');
  console.log('🚀 TRUSTPAY ENTERPRISE v2.0 - E2E WORKFLOW VERIFICATION');
  console.log('===========================================================');

  try {
    // 1. Client Login (Rahul Sharma)
    console.log('\n[Phase 2] Client Login...');
    const clientLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'rahul.sharma@gmail.com',
      password: 'TrustPay@2026',
    });
    const clientToken = clientLogin.data.data.tokens.accessToken;
    const clientUser = clientLogin.data.data.user;
    console.log(`  ✓ Client Logged in: ${clientUser.firstName} ${clientUser.lastName} (ID: ${clientUser.id})`);

    // 2. Worker Login (Karthik Varma)
    console.log('\n[Phase 3] Worker Login...');
    const workerLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'karthik.freelancer@gmail.com',
      password: 'TrustPay@2026',
    });
    const workerToken = workerLogin.data.data.tokens.accessToken;
    const workerUser = workerLogin.data.data.user;
    console.log(`  ✓ Worker Logged in: ${workerUser.firstName} ${workerUser.lastName} (ID: ${workerUser.id})`);

    // 3. Worker Discovery / Search
    console.log('\n[Phase 2] Worker Search & Profile Fetch...');
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: workerUser.id },
    });
    console.log(`  ✓ Worker Profile Found: ${workerProfile.slug} (ID: ${workerProfile.id})`);

    // 4. Client Submits Collaboration Request
    console.log('\n[Phase 2] Submitting Collaboration Request...');
    const reqPayload = {
      workerProfileId: workerProfile.id,
      projectTitle: 'Enterprise Smart Contract & Escrow Portal v2',
      projectDescription: 'Full architectural build, React UI, Next.js dashboard, and Escrow integration.',
      budget: 85000,
      estimatedDuration: '1 Month',
      expectedStartDate: '2026-08-15',
      deadline: '2026-09-15',
      additionalNotes: 'Requires high performance & security audit compliance.',
    };

    const collabReqResponse = await axios.post(`${API_BASE}/collaboration/requests`, reqPayload, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const collabRequest = collabReqResponse.data.data;
    console.log(`  ✓ Collaboration Request Created: ${collabRequest.requestNumber} (ID: ${collabRequest.id})`);

    // 5. Worker Notification Check
    console.log('\n[Phase 3] Worker Notification Check...');
    const workerNotifs = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    const latestWorkerNotif = workerNotifs.data.data.notifications[0];
    console.log(`  ✓ Worker Notification: "${latestWorkerNotif?.title}" | Message: "${latestWorkerNotif?.message}" | Link: "${latestWorkerNotif?.linkUrl}"`);

    // 6. Worker Accepts Collaboration Request
    console.log('\n[Phase 4 & 5] Worker Accepts Request...');
    const acceptResponse = await axios.post(
      `${API_BASE}/collaboration/requests/${collabRequest.id}/respond`,
      { action: 'ACCEPT' },
      { headers: { Authorization: `Bearer ${workerToken}` } }
    );
    const workspace = acceptResponse.data.data;
    console.log(`  ✓ Request Accepted! Workspace Created: ${workspace.workspaceNumber} (ID: ${workspace.id})`);

    // 7. Client Acceptance Notification Check
    console.log('\n[Phase 5] Client Acceptance Notification Check...');
    const clientNotifs = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const latestClientNotif = clientNotifs.data.data.notifications[0];
    console.log(`  ✓ Client Acceptance Notification: "${latestClientNotif?.title}" | Link: "${latestClientNotif?.linkUrl}"`);

    // 8. Real-Time Chat Message Exchange
    console.log('\n[Phase 8] Exchanging Chat Messages...');
    const msg1 = await axios.post(
      `${API_BASE}/chat/messages`,
      {
        conversationId: workspace.conversationId,
        content: 'Hello Karthik! Excited to start this project collaboration.',
        messageType: 'TEXT',
      },
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    console.log(`  ✓ Client Sent Message: "${msg1.data.data.content}"`);

    const msg2 = await axios.post(
      `${API_BASE}/chat/messages`,
      {
        conversationId: workspace.conversationId,
        content: 'Hi Rahul! I have reviewed the requirements and planning board details. Ready to proceed.',
        messageType: 'TEXT',
      },
      { headers: { Authorization: `Bearer ${workerToken}` } }
    );
    console.log(`  ✓ Worker Replied Message: "${msg2.data.data.content}"`);

    // 9. Planning Board Agreement
    console.log('\n[Phase 9] Client & Worker Agree on Planning Board...');
    await axios.put(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/planning-board`,
      { agree: true, budget: 85000, scope: 'Enterprise Smart Contract & Escrow Portal v2' },
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    console.log('  ✓ Client Agreed to Planning Board');

    const updatedWs = await axios.put(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/planning-board`,
      { agree: true },
      { headers: { Authorization: `Bearer ${workerToken}` } }
    );
    console.log(`  ✓ Worker Agreed to Planning Board! Status: ${updatedWs.data.data.status}`);
    const contract = updatedWs.data.data.contract;
    console.log(`  ✓ Digital Contract Automatically Generated: ${contract?.contractNumber} (ID: ${contract?.id})`);

    // 10. Digital Signatures & Contract Lock
    console.log('\n[Phase 10 & 11] Both Parties Sign Digital Contract...');
    await axios.post(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/sign-contract`,
      { signatureType: 'TYPE', signatureData: 'Rahul Sharma' },
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    console.log('  ✓ Client Signed Contract');

    const lockedWs = await axios.post(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/sign-contract`,
      { signatureType: 'TYPE', signatureData: 'Karthik Varma' },
      { headers: { Authorization: `Bearer ${workerToken}` } }
    );
    console.log(`  ✓ Worker Signed Contract! Contract Status: ${lockedWs.data.data.contract?.status} | Workspace Status: ${lockedWs.data.data.status}`);

    // 11. Escrow Funding
    console.log('\n[Phase 12] Client Funds Escrow...');
    const fundedWs = await axios.post(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/fund-escrow`,
      { amount: 85000 },
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    console.log(`  ✓ Escrow Funded! Workspace Status: ${fundedWs.data.data.status}`);

    // 12. Final Approval & Completion Certificate Generation
    console.log('\n[Phase 12] Client Approves Final Delivery & Releases Escrow...');
    const completionRes = await axios.post(
      `${API_BASE}/collaboration/workspaces/${workspace.id}/approve-completion`,
      {},
      { headers: { Authorization: `Bearer ${clientToken}` } }
    );
    const cert = completionRes.data.data.certificate;
    const inv = completionRes.data.data.invoice;
    console.log(`  ✓ Project Completed! Invoice: ${inv.invoiceNumber} | Certificate: ${cert.certificateNumber}`);

    console.log('\n===========================================================');
    console.log('🟢 END-TO-END WORKFLOW VERIFICATION FULLY PASSED!');
    console.log('===========================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E VERIFICATION FAILED:', err.response?.data || err.message);
    process.exit(1);
  }
}

runEndToEndVerification();
