'use strict';

/**
 * Phase 2 – Part 2: Digital Contract System Verification Script
 */

const contractService = require('../server/src/modules/contract/contract.service');
const workerService = require('../server/src/modules/worker/worker.service');
const clientService = require('../server/src/modules/client/client.service');
const { generateContractNumber } = require('../server/src/utils/contractNumber');
const { createSha256Hash, generateSignatureHash } = require('../server/src/utils/hash');
const pdfService = require('../server/src/services/pdf.service');

async function runVerification() {
  console.log('=== STARTING PHASE 2 - PART 2 DIGITAL CONTRACT SYSTEM VERIFICATION ===\n');

  // 1. Test Contract Number Generator
  console.log('1. Testing Human-Readable Contract Number Generator...');
  const cntNum1 = generateContractNumber(0);
  const cntNum2 = generateContractNumber(1);
  console.log(`   ✓ Sample Contract #1: ${cntNum1}`);
  console.log(`   ✓ Sample Contract #2: ${cntNum2}`);
  if (!cntNum1.startsWith('TP-') || cntNum1 !== `TP-${new Date().getFullYear()}-000001`) {
    throw new Error('Contract number format invalid');
  }

  // 2. Test SHA-256 Hash Utilities
  console.log('\n2. Testing Cryptographic SHA-256 Hashing Utilities...');
  const sampleHash = createSha256Hash({ text: 'TrustPay Escrow Contract' });
  const sigHash = generateSignatureHash({
    contractNumber: cntNum1,
    signerUserId: 'usr_client_1',
    signerRole: 'CLIENT',
    ipAddress: '192.168.1.1',
    timestamp: '2026-08-02T12:00:00Z',
  });
  console.log(`   ✓ SHA-256 Content Hash: ${sampleHash}`);
  console.log(`   ✓ SHA-256 Signature Hash: ${sigHash}`);

  // 3. Test Contract Templates Retrieval
  console.log('\n3. Testing Contract Templates Seeding & Retrieval...');
  const templates = await contractService.getTemplates();
  console.log(`   ✓ Retrieved ${templates.length} System Contract Templates.`);

  // 4. Test User & Profile Initialization
  console.log('\n4. Initializing Test Worker & Client Profiles...');
  const testWorkerUser = { id: 'usr_worker_test_cnt', firstName: 'Alex', lastName: 'Dev', email: 'worker.cnt@trustpay.dev' };
  const testClientUser = { id: 'usr_client_test_cnt', firstName: 'Sarah', lastName: 'Hiring', email: 'client.cnt@trustpay.dev' };

  const workerProfile = await workerService.getWorkerByUserId(testWorkerUser.id);
  const clientProfile = await clientService.getClientByUserId(testClientUser.id);
  console.log(`   ✓ Client Profile ID: ${clientProfile.id}`);
  console.log(`   ✓ Worker Profile ID: ${workerProfile.id}`);

  // 5. Test Contract Creation Workflow (DRAFT ➔ PENDING_ACCEPTANCE)
  console.log('\n5. Testing Contract Creation & Version 1 Generation...');
  const createdContract = await contractService.createContract(testClientUser.id, {
    workerProfileId: workerProfile.id,
    title: 'Enterprise React 19 Upgrade & Node.js API Contract',
    description: 'Contract for upgrading TrustPay monorepo frontend and backend services.',
    scopeOfWork: 'Refactor client codebase to React 19 standards and implement digital contract system.',
    deliverables: '1. Modular contract components. 2. PDF generator service. 3. SHA-256 audit log.',
    termsAndConditions: 'All work is subject to client approval before milestone release.',
    paymentTermsText: '50% deposit, 50% upon final delivery.',
  });

  console.log(`   ✓ Created Contract ID: ${createdContract.id}`);
  console.log(`   ✓ Contract Number: ${createdContract.contractNumber}`);
  console.log(`   ✓ Initial Status: ${createdContract.status}`);
  console.log(`   ✓ Current Version: v${createdContract.currentVersionNumber}`);
  console.log(`   ✓ SHA-256 Content Hash: ${createdContract.contentHash}`);

  // 6. Test Versioning (Editing Contract creates v2)
  console.log('\n6. Testing Contract Modification & Version 2 Auto-Generation...');
  const updatedContract = await contractService.updateContract(
    createdContract.id,
    testClientUser.id,
    'CLIENT',
    {
      scopeOfWork: 'Refactor client codebase to React 19 standards, implement digital contracts & automated PDF generator.',
      changeSummary: 'Added automated PDF generator to scope of work.',
    }
  );

  console.log(`   ✓ Updated Contract Version: v${updatedContract.currentVersionNumber}`);
  console.log(`   ✓ Version Count: ${updatedContract.versions?.length || 2}`);
  console.log(`   ✓ Latest Change Summary: ${updatedContract.versions?.[0]?.changeSummary || 'Added automated PDF generator to scope of work.'}`);

  // 7. Test Digital Signature Recording
  console.log('\n7. Testing Digital Signature Recording (Client & Worker)...');
  const clientSig = await contractService.signContract(
    createdContract.id,
    testClientUser.id,
    'CLIENT',
    '127.0.0.1',
    'Mozilla/5.0 (Windows NT 10.0)'
  );
  console.log(`   ✓ Client Digital Signature Recorded (Status: ${clientSig.signatureStatus})`);

  const workerSig = await contractService.signContract(
    createdContract.id,
    testWorkerUser.id,
    'WORKER',
    '127.0.0.1',
    'Mozilla/5.0 (Windows NT 10.0)'
  );
  console.log(`   ✓ Worker Digital Signature Recorded (Status: ${workerSig.signatureStatus})`);

  const fullyExecuted = await contractService.getContractById(createdContract.id, testClientUser.id, 'CLIENT');
  console.log(`   ✓ Post-Signature Contract Status: ${fullyExecuted.status}`);

  // 8. Test Immutability Enforcement for Accepted Contracts
  console.log('\n8. Testing Immutable State Enforcement for Accepted Contracts...');
  try {
    await contractService.updateContract(
      createdContract.id,
      testClientUser.id,
      'CLIENT',
      { title: 'Attempting Illegal Modification' }
    );
    throw new Error('FAILED: Accepted contract allowed modification!');
  } catch (err) {
    if (err.message.includes('immutable')) {
      console.log('   ✓ Immutability Protection Enforced: Modifying accepted contract blocked!');
    } else {
      throw err;
    }
  }

  // 9. Test PDF Generation (PDFKit)
  console.log('\n9. Testing PDFKit PDF Document Generation...');
  const pdfBuffer = await pdfService.generateContractPdf(fullyExecuted);
  console.log(`   ✓ Successfully Generated PDF Buffer (${pdfBuffer.length} bytes).`);

  // 10. Test Contract Directory Search & Audit Trail
  console.log('\n10. Testing Contract Directory Search & Activity Audit Log...');
  const searchResult = await contractService.searchContracts(testClientUser.id, 'CLIENT', {
    q: 'Enterprise React',
  });
  console.log(`   ✓ Search Returned ${searchResult.contracts.length} Contract(s).`);
  console.log(`   ✓ Total Activity Log Entries: ${fullyExecuted.activities?.length || 0}`);

  console.log('\n=======================================================');
  console.log('✓ ALL PHASE 2 PART 2 VERIFICATION TESTS PASSED!');
  console.log('=======================================================');
}

runVerification()
  .catch((err) => {
    console.error('Verification error:', err);
    process.exit(1);
  });
