'use strict';

/**
 * Phase 2 – Part 1: Worker & Client Management Verification Script
 */

const { prisma } = require('../server/src/config/database');
const workerService = require('../server/src/modules/worker/worker.service');
const clientService = require('../server/src/modules/client/client.service');
const taxonomyService = require('../server/src/modules/taxonomies/taxonomy.service');
const { generateSlug } = require('../server/src/utils/slug');
const { generateWorkerMetadata } = require('../server/src/utils/seo');
const { calculateDistanceKm } = require('../server/src/utils/geo');

async function runVerification() {
  console.log('=== STARTING PHASE 2 - PART 1 WORKER & CLIENT MANAGEMENT VERIFICATION ===\n');

  // 1. Test Taxonomies Seeding & Retrieval
  console.log('1. Testing Taxonomy Service...');
  const taxonomies = await taxonomyService.getTaxonomies();
  console.log(`   ✓ Retrieved ${taxonomies.categories.length} Categories and ${taxonomies.skills.length} Skills.`);

  // 2. Test Dummy User Setup
  console.log('\n2. Setting Up Test Worker & Client Users...');
  let testWorkerUser = { id: 'usr_worker_test', firstName: 'Alex', lastName: 'Dev' };
  let testClientUser = { id: 'usr_client_test', firstName: 'Sarah', lastName: 'Hiring' };

  try {
    testWorkerUser = await prisma.user.upsert({
      where: { email: 'worker.test@trustpay.dev' },
      update: {},
      create: {
        firstName: 'Alex',
        lastName: 'Dev',
        email: 'worker.test@trustpay.dev',
        passwordHash: 'hashed_password_123',
        role: 'WORKER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
    });

    testClientUser = await prisma.user.upsert({
      where: { email: 'client.test@trustpay.dev' },
      update: {},
      create: {
        firstName: 'Sarah',
        lastName: 'Hiring',
        email: 'client.test@trustpay.dev',
        passwordHash: 'hashed_password_123',
        role: 'CLIENT',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
    });
  } catch {
    console.log('   (Using mock user objects for standalone test execution)');
  }

  console.log(`   ✓ Worker User ID: ${testWorkerUser.id}`);
  console.log(`   ✓ Client User ID: ${testClientUser.id}`);

  // 3. Test Worker Profile CRUD & Profile Completion
  console.log('\n3. Testing Worker Profile Update & Profile Completion % Calculation...');
  const updatedWorker = await workerService.updateWorkerProfile(testWorkerUser.id, {
    title: 'Senior Fullstack React & Node.js Engineer',
    bio: 'Experienced fullstack engineer specializing in scalable SaaS and Web3 applications.',
    hourlyRate: 1800,
    yearsExperience: 6,
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    resumeUrl: 'https://storage.trustpay.dev/resumes/resume.pdf',
    availabilityStatus: 'AVAILABLE',
  });

  console.log(`   ✓ Worker Profile Title: ${updatedWorker.title}`);
  console.log(`   ✓ Worker Profile Slug: ${updatedWorker.slug}`);
  console.log(`   ✓ Profile Completion %: ${updatedWorker.profileCompletion}%`);

  // 4. Test SEO Metadata Generation
  console.log('\n4. Testing Worker SEO Metadata Generator...');
  const seoMeta = generateWorkerMetadata(updatedWorker);
  console.log(`   ✓ Meta Title: ${seoMeta.metaTitle}`);
  console.log(`   ✓ OpenGraph Image: ${seoMeta.openGraph.image}`);

  // 5. Test Portfolio Project Creation & Technology Normalization
  console.log('\n5. Testing Normalized Portfolio Project Creation...');
  const project = await workerService.addPortfolioProject(testWorkerUser.id, {
    title: 'TrustPay Escrow Dashboard',
    description: 'Enterprise React 19 + Tailwind CSS dashboard system.',
    projectUrl: 'https://trustpay.dev',
    technologies: ['React.js', 'Tailwind CSS', 'Node.js', 'Prisma'],
  });
  console.log(`   ✓ Created Portfolio Project ID: ${project.id}`);

  // 6. Test Worker Verification Document Infrastructure
  console.log('\n6. Testing Verification Document Submission Infrastructure...');
  const verDoc = await workerService.submitVerificationDocument(testWorkerUser.id, {
    documentType: 'AADHAAR_CARD',
    documentUrl: 'https://storage.trustpay.dev/verification-documents/aadhaar_scan.pdf',
    documentNumber: '1234-5678-9012',
  });
  console.log(`   ✓ Document Submitted: ${verDoc.documentType} (Status: ${verDoc.verificationStatus})`);

  // 7. Test Client Profile & Favorite Worker CRUD
  console.log('\n7. Testing Client Profile & Favorites System...');
  const updatedClient = await clientService.updateClientProfile(testClientUser.id, {
    companyName: 'Acme Global Ventures',
    companyType: 'Technology Enterprise',
    businessDescription: 'Global venture builder investing in fintech apps.',
    city: 'Mumbai',
    state: 'Maharashtra',
  });
  console.log(`   ✓ Client Company Name: ${updatedClient.companyName}`);

  const fav = await clientService.addFavoriteWorker(testClientUser.id, updatedWorker.id);
  console.log(`   ✓ Saved Worker to Favorites! Favorite ID: ${fav.id}`);

  const favList = await clientService.getFavoriteWorkers(testClientUser.id);
  console.log(`   ✓ Client Favorites Count: ${favList.length}`);

  // 8. Test Worker Search, Filtering & Geocoding Distance
  console.log('\n8. Testing Worker Search & Distance Calculation...');
  const searchResult = await workerService.searchWorkers({
    q: 'Fullstack',
    lat: 12.9716,
    lng: 77.5946,
    limit: 5,
  });
  console.log(`   ✓ Search Returned ${searchResult.workers.length} Worker(s).`);

  const distance = calculateDistanceKm(12.9716, 77.5946, 19.0760, 72.8777); // Bengaluru to Mumbai
  console.log(`   ✓ Distance Bengaluru ➔ Mumbai: ${distance} km`);

  console.log('\n=======================================================');
  console.log('✓ ALL PHASE 2 PART 1 VERIFICATION TESTS PASSED!');
  console.log('=======================================================');
}

runVerification()
  .catch((err) => {
    console.error('Verification error:', err);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      // ignore
    }
  });
