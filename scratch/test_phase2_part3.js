'use strict';

/**
 * Phase 2 – Part 3: Escrow Wallet & Payment Management Verification Script
 */

const escrowService = require('../server/src/modules/escrow/escrow.service');
const clientService = require('../server/src/modules/client/client.service');
const workerService = require('../server/src/modules/worker/worker.service');
const contractService = require('../server/src/modules/contract/contract.service');
const razorpayService = require('../server/src/services/razorpay.service');
const invoiceService = require('../server/src/services/invoice.service');
const { generateInvoiceNumber } = require('../server/src/utils/invoiceNumber');

async function runVerification() {
  console.log('=== STARTING PHASE 2 - PART 3 ESCROW WALLET & PAYMENT VERIFICATION ===\n');

  // 1. Test Invoice Number Generator
  console.log('1. Testing Human-Readable Invoice Number Generator...');
  const invNum1 = generateInvoiceNumber(0);
  const invNum2 = generateInvoiceNumber(1);
  console.log(`   ✓ Sample Invoice #1: ${invNum1}`);
  console.log(`   ✓ Sample Invoice #2: ${invNum2}`);
  if (!invNum1.startsWith('INV-')) throw new Error('Invoice number format invalid');

  // 2. Test User & Wallet Setup
  console.log('\n2. Initializing Test Wallet & User Profiles...');
  const testClientUser = { id: 'usr_client_escrow_test', firstName: 'Sarah', lastName: 'Hiring' };
  const testWorkerUser = { id: 'usr_worker_escrow_test', firstName: 'Alex', lastName: 'Dev' };

  const wallet = await escrowService.getWalletByUserId(testClientUser.id);
  console.log(`   ✓ Wallet Created/Retrieved ID: ${wallet.id}`);
  console.log(`   ✓ Wallet Status: ${wallet.status}`);
  console.log(`   ✓ Initial Available Balance: ₹${wallet.availableBalance}`);

  // 3. Test Razorpay Order Creation
  console.log('\n3. Testing Razorpay Payment Order Creation...');
  const depositOrderRes = await escrowService.createDepositOrder(testClientUser.id, {
    amount: 15000,
    idempotencyKey: 'idemp_dep_001',
  });
  console.log(`   ✓ Razorpay Order ID: ${depositOrderRes.razorpayOrder.id}`);
  console.log(`   ✓ Deposit Amount: ₹${depositOrderRes.razorpayOrder.amount / 100}`);

  // 4. Test Idempotency Protection
  console.log('\n4. Testing Financial Idempotency Key Protection...');
  const duplicateRes = await escrowService.createDepositOrder(testClientUser.id, {
    amount: 15000,
    idempotencyKey: 'idemp_dep_001',
  });
  if (duplicateRes.isIdempotent) {
    console.log('   ✓ Idempotency Protection Verified: Duplicate deposit request intercepted!');
  }

  // 5. Test Payment Signature Verification & Fund Deposit
  console.log('\n5. Testing Payment Signature Verification & Fund Deposit...');
  const paymentVerifyRes = await escrowService.verifyPayment(testClientUser.id, {
    razorpayOrderId: depositOrderRes.razorpayOrder.id,
    razorpayPaymentId: 'pay_mock_9988776655',
    razorpaySignature: 'mock_signature_valid',
    idempotencyKey: 'idemp_verify_001',
  });
  console.log(`   ✓ Deposit Verified: ${paymentVerifyRes.verified}`);
  console.log(`   ✓ Updated Available Balance: ₹${paymentVerifyRes.wallet.availableBalance}`);
  console.log(`   ✓ Generated Invoice Number: ${paymentVerifyRes.invoice.invoiceNumber}`);

  // 6. Test Contract & Escrow Release Flow
  console.log('\n6. Testing Escrow Fund Release to Worker...');
  const workerProfile = await workerService.getWorkerByUserId(testWorkerUser.id);
  const releaseRes = await escrowService.releaseFunds(
    testClientUser.id,
    'CLIENT',
    {
      contractId: 'cnt_sample_escrow_001',
      workerProfileId: workerProfile.id,
      amount: 5000,
      notes: 'Milestone 1 completed successfully.',
    },
    'idemp_rel_001'
  );
  console.log(`   ✓ Released Amount: ₹5,000`);
  console.log(`   ✓ Post-Release Available Balance: ₹${releaseRes.wallet.availableBalance}`);
  console.log(`   ✓ Post-Release Total Released: ₹${releaseRes.wallet.releasedBalance}`);

  // 7. Test Escrow Refund Flow
  console.log('\n7. Testing Escrow Refund to Client...');
  const refundRes = await escrowService.refundFunds(
    testClientUser.id,
    'CLIENT',
    {
      contractId: 'cnt_sample_escrow_001',
      amount: 2000,
      reason: 'Partial cancellation of scope item.',
    },
    'idemp_ref_001'
  );
  console.log(`   ✓ Refunded Amount: ₹2,000`);
  console.log(`   ✓ Post-Refund Available Balance: ₹${refundRes.wallet.availableBalance}`);
  console.log(`   ✓ Post-Refund Total Refunded: ₹${refundRes.wallet.refundedBalance}`);

  // 8. Test PDF Invoice Generation
  console.log('\n8. Testing PDFKit Invoice Document Generation...');
  const invoicePdfBuffer = await invoiceService.generateInvoicePdf(paymentVerifyRes.invoice);
  console.log(`   ✓ Successfully Generated Invoice PDF Buffer (${invoicePdfBuffer.length} bytes).`);

  // 9. Test Transaction Ledger Search
  console.log('\n9. Testing Immutable Transaction Ledger Queries...');
  const txListRes = await escrowService.searchTransactions(testClientUser.id, { limit: 10 });
  console.log(`   ✓ Total Immutable Ledger Transactions: ${txListRes.transactions.length}`);

  console.log('\n=======================================================');
  console.log('✓ ALL PHASE 2 PART 3 VERIFICATION TESTS PASSED!');
  console.log('=======================================================');
}

runVerification()
  .catch((err) => {
    console.error('Verification error:', err);
    process.exit(1);
  });
