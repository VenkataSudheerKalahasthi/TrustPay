'use strict';

const path = require('path');
const serverDir = path.resolve(__dirname, '../server');
process.chdir(serverDir);

const authService = require(path.join(serverDir, 'src/modules/auth/auth.service'));
const sessionRepository = require(path.join(serverDir, 'src/modules/auth/session.repository'));
const authRepository = require(path.join(serverDir, 'src/modules/auth/auth.repository'));
const { parseRequestInfo } = require(path.join(serverDir, 'src/utils/requestInfo'));

// In-Memory Database Stores
const usersStore = new Map();
const refreshTokensStore = new Map();
const sessionsStore = new Map();

let idCounter = 1;
function genId(prefix) {
  return `${prefix}_${idCounter++}`;
}

// Override repository methods for mock unit testing
function setupMockRepositories() {
  authRepository.findByEmail = async (email) => {
    if (!email) return null;
    for (const u of usersStore.values()) {
      if (u.email === email.toLowerCase()) return { ...u };
    }
    return null;
  };

  authRepository.findById = async (id) => {
    return usersStore.get(id) ? { ...usersStore.get(id) } : null;
  };

  authRepository.findByVerificationToken = async (tokenHash) => {
    for (const u of usersStore.values()) {
      if (u.emailVerificationToken === tokenHash) return { ...u };
    }
    return null;
  };

  authRepository.findByResetToken = async (tokenHash) => {
    for (const u of usersStore.values()) {
      if (u.passwordResetToken === tokenHash) return { ...u };
    }
    return null;
  };

  authRepository.create = async (data) => {
    const id = genId('usr');
    const record = { id, isActive: true, isEmailVerified: false, ...data, createdAt: new Date(), updatedAt: new Date() };
    usersStore.set(id, record);
    return { ...record };
  };

  authRepository.update = async (id, data) => {
    const u = usersStore.get(id);
    if (!u) throw new Error('User not found');
    const updated = { ...u, ...data, updatedAt: new Date() };
    usersStore.set(id, updated);
    return { ...updated };
  };

  authRepository.updateLastLogin = async (id) => {
    const u = usersStore.get(id);
    if (u) u.lastLogin = new Date();
    return u;
  };

  authRepository.createRefreshToken = async ({ userId, tokenHash, expiresAt }) => {
    const id = genId('rt');
    const record = { id, userId, tokenHash, expiresAt, isRevoked: false, createdAt: new Date(), updatedAt: new Date() };
    refreshTokensStore.set(id, record);
    return { ...record };
  };

  authRepository.findRefreshToken = async (tokenHash) => {
    let found = null;
    for (const rt of refreshTokensStore.values()) {
      if (rt.tokenHash === tokenHash) {
        found = { ...rt };
        break;
      }
    }
    if (found) {
      found.user = usersStore.get(found.userId) ? { ...usersStore.get(found.userId) } : null;
      for (const s of sessionsStore.values()) {
        if (s.refreshTokenId === found.id) {
          found.session = { ...s };
          break;
        }
      }
    }
    return found;
  };

  authRepository.revokeRefreshToken = async (id, replacedByToken = null) => {
    const rt = refreshTokensStore.get(id);
    if (rt) {
      rt.isRevoked = true;
      rt.replacedByToken = replacedByToken;
      rt.updatedAt = new Date();
    }
    return rt;
  };

  authRepository.revokeAllUserRefreshTokens = async (userId) => {
    let count = 0;
    for (const rt of refreshTokensStore.values()) {
      if (rt.userId === userId && !rt.isRevoked) {
        rt.isRevoked = true;
        rt.updatedAt = new Date();
        count++;
      }
    }
    return { count };
  };

  // Session repository overrides
  sessionRepository.createSession = async ({ userId, refreshTokenId, deviceName, browser, operatingSystem, ipAddress, expiresAt }) => {
    const id = genId('sess');
    const record = {
      id,
      userId,
      refreshTokenId,
      deviceName,
      browser,
      operatingSystem,
      ipAddress,
      loginTime: new Date(),
      lastActiveTime: new Date(),
      expiresAt,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sessionsStore.set(id, record);
    return { ...record };
  };

  sessionRepository.findByRefreshTokenId = async (refreshTokenId) => {
    if (!refreshTokenId) return null;
    for (const s of sessionsStore.values()) {
      if (s.refreshTokenId === refreshTokenId) return { ...s };
    }
    return null;
  };

  sessionRepository.findActiveSessionsByUserId = async (userId) => {
    const results = [];
    for (const s of sessionsStore.values()) {
      if (s.userId === userId && s.status === 'ACTIVE') {
        results.push({ ...s });
      }
    }
    return results;
  };

  sessionRepository.updateSessionOnRotation = async (oldRefreshTokenId, newRefreshTokenId, expiresAt) => {
    for (const s of sessionsStore.values()) {
      if (s.refreshTokenId === oldRefreshTokenId) {
        s.refreshTokenId = newRefreshTokenId;
        s.lastActiveTime = new Date();
        s.expiresAt = expiresAt;
        s.updatedAt = new Date();
        return { ...s };
      }
    }
    return null;
  };

  sessionRepository.revokeSession = async (sessionId) => {
    const s = sessionsStore.get(sessionId);
    if (s) {
      s.status = 'REVOKED';
      s.logoutTime = new Date();
      s.updatedAt = new Date();
    }
    return s;
  };

  sessionRepository.revokeSessionByRefreshTokenId = async (refreshTokenId) => {
    let count = 0;
    for (const s of sessionsStore.values()) {
      if (s.refreshTokenId === refreshTokenId && s.status === 'ACTIVE') {
        s.status = 'REVOKED';
        s.logoutTime = new Date();
        s.updatedAt = new Date();
        count++;
      }
    }
    return { count };
  };

  sessionRepository.revokeAllUserSessions = async (userId) => {
    let count = 0;
    for (const s of sessionsStore.values()) {
      if (s.userId === userId && s.status === 'ACTIVE') {
        s.status = 'REVOKED';
        s.logoutTime = new Date();
        s.updatedAt = new Date();
        count++;
      }
    }
    return { count };
  };

  sessionRepository.markSessionExpired = async (sessionId) => {
    const s = sessionsStore.get(sessionId);
    if (s) {
      s.status = 'EXPIRED';
      s.updatedAt = new Date();
    }
    return s;
  };
}

function mockRequest({ ip = '192.168.1.50', userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', requestId = 'req-test-123' } = {}) {
  return {
    headers: {
      'user-agent': userAgent,
      'x-request-id': requestId,
      'x-forwarded-for': ip,
    },
    ip,
    requestId,
  };
}

async function runVerification() {
  console.log('=== STARTING TRUSTPAY ENTERPRISE AUTHENTICATION REFINEMENT VERIFICATION ===\n');

  setupMockRepositories();

  const testEmail = `test.refinement.${Date.now()}@trustpay.dev`;
  const password = 'Password@123!';
  const reqMock = mockRequest();

  // 1. Request Info Utility Test
  console.log('1. Testing Request Parsing Utility (requestInfo.js)...');
  const parsed = parseRequestInfo(reqMock);
  console.log('   ✓ Parsed Client Info:', {
    ip: parsed.ipAddress,
    browser: parsed.browser,
    os: parsed.operatingSystem,
    device: parsed.deviceType,
    requestId: parsed.requestId,
  });
  if (parsed.browser !== 'Chrome 120' || parsed.operatingSystem !== 'Windows 10/11' || parsed.deviceType !== 'Desktop') {
    throw new Error('User-Agent parsing assertion failed');
  }

  // 2. User Registration Test
  console.log('\n2. Testing User Registration & Session Creation...');
  const regResult = await authService.register(
    {
      firstName: 'Enterprise',
      lastName: 'Tester',
      email: testEmail,
      password,
      role: 'CLIENT',
    },
    reqMock
  );

  console.log('   ✓ Registered User ID:', regResult.user.id);
  console.log('   ✓ Access Token Issued:', !!regResult.accessToken);
  console.log('   ✓ Refresh Token Issued:', !!regResult.refreshToken);

  const regSessions = await sessionRepository.findActiveSessionsByUserId(regResult.user.id);
  console.log('   ✓ Active Sessions Count after Registration:', regSessions.length);
  if (regSessions.length !== 1) throw new Error('Expected 1 active session');
  console.log('   ✓ Session Data:', {
    id: regSessions[0].id,
    browser: regSessions[0].browser,
    os: regSessions[0].operatingSystem,
    ip: regSessions[0].ipAddress,
    status: regSessions[0].status,
  });

  // 3. User Login Test (Second Device)
  console.log('\n3. Testing Login & Second Device Session Creation...');
  const loginReq = mockRequest({ ip: '10.0.0.99', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1' });
  const loginResult = await authService.login({ email: testEmail, password }, loginReq);

  console.log('   ✓ Login Successful');
  const postLoginSessions = await sessionRepository.findActiveSessionsByUserId(regResult.user.id);
  console.log('   ✓ Active Sessions Count after Second Device Login:', postLoginSessions.length);
  if (postLoginSessions.length !== 2) throw new Error('Expected 2 active sessions');

  // 4. Refresh Token Exchange & Session Rotation Test
  console.log('\n4. Testing Token Refresh & Session Rotation...');
  const refreshResult = await authService.refreshSession(loginResult.refreshToken, loginReq);
  console.log('   ✓ Token Refreshed Successfully!');
  console.log('   ✓ New Refresh Token Issued:', !!refreshResult.refreshToken);

  const activeAfterRotation = await sessionRepository.findActiveSessionsByUserId(regResult.user.id);
  console.log('   ✓ Active Sessions Count after Rotation:', activeAfterRotation.length);
  if (activeAfterRotation.length !== 2) throw new Error('Expected 2 active sessions post-rotation');

  // 5. Single Device Logout Test
  console.log('\n5. Testing Single Device Logout...');
  await authService.logout(refreshResult.refreshToken, loginReq);
  const activeAfterSingleLogout = await sessionRepository.findActiveSessionsByUserId(regResult.user.id);
  console.log('   ✓ Active Sessions Count after Single Logout:', activeAfterSingleLogout.length);
  if (activeAfterSingleLogout.length !== 1) throw new Error('Expected 1 remaining active session');

  // 6. Logout All Devices Test
  console.log('\n6. Testing Logout All Devices...');
  await authService.logoutAll(regResult.user.id, reqMock);
  const activeAfterLogoutAll = await sessionRepository.findActiveSessionsByUserId(regResult.user.id);
  console.log('   ✓ Active Sessions Count after Logout All:', activeAfterLogoutAll.length);
  if (activeAfterLogoutAll.length !== 0) throw new Error('Expected 0 active sessions after logoutAll');

  // 7. Token Reuse Security Alert Test
  console.log('\n7. Testing Revoked Token Reuse Detection...');
  let reuseDetected = false;
  try {
    await authService.refreshSession(loginResult.refreshToken, loginReq);
  } catch (err) {
    reuseDetected = true;
    console.log('   ✓ Security Alert Caught (Token Reuse):', err.message);
  }
  if (!reuseDetected) throw new Error('Security Failure: Revoked token reuse was not caught!');

  console.log('\n=======================================================');
  console.log('✓ ALL ENTERPRISE REFINEMENT VERIFICATION TESTS PASSED!');
  console.log('=======================================================');
}

runVerification().catch((err) => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
