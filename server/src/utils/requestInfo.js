'use strict';

/**
 * Utility functions for parsing request metadata and client information.
 */

/**
 * Parse client information (IP, User Agent, Browser, OS, Device Type, Request ID) from Express request.
 *
 * @param {import('express').Request} req
 * @returns {{
 *   ipAddress: string,
 *   userAgent: string,
 *   browser: string,
 *   operatingSystem: string,
 *   deviceType: string,
 *   deviceName: string,
 *   requestId: string|null
 * }}
 */
function parseRequestInfo(req) {
  if (!req) {
    return {
      ipAddress: 'Unknown',
      userAgent: 'Unknown',
      browser: 'Unknown',
      operatingSystem: 'Unknown',
      deviceType: 'Unknown',
      deviceName: 'Unknown Device',
      requestId: null,
    };
  }

  // Extract IP address (handles reverse proxies, X-Forwarded-For)
  let ipAddress = 'Unknown';
  if (req.headers && req.headers['x-forwarded-for']) {
    const forwarded = req.headers['x-forwarded-for'];
    ipAddress = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
  } else if (req.ip) {
    ipAddress = req.ip;
  } else if (req.socket && req.socket.remoteAddress) {
    ipAddress = req.socket.remoteAddress;
  }

  // Normalize IPv6 localhost
  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
    ipAddress = '127.0.0.1';
  }

  const userAgent = req.headers ? (req.headers['user-agent'] || 'Unknown') : 'Unknown';
  const requestId = req.requestId || (req.headers ? req.headers['x-request-id'] : null) || null;

  const { browser, operatingSystem, deviceType, deviceName } = parseUserAgent(userAgent);

  return {
    ipAddress,
    userAgent,
    browser,
    operatingSystem,
    deviceType,
    deviceName,
    requestId,
  };
}

/**
 * Helper to parse user agent string for Browser, OS, and Device.
 *
 * @param {string} ua
 * @returns {{ browser: string, operatingSystem: string, deviceType: string, deviceName: string }}
 */
function parseUserAgent(ua) {
  if (!ua || ua === 'Unknown') {
    return {
      browser: 'Unknown',
      operatingSystem: 'Unknown',
      deviceType: 'Unknown',
      deviceName: 'Unknown Device',
    };
  }

  let browser = 'Unknown Browser';
  let operatingSystem = 'Unknown OS';
  let deviceType = 'Desktop';

  // 1. Operating System Detection
  if (/windows nt 10/i.test(ua)) {operatingSystem = 'Windows 10/11';}
  else if (/windows nt 6\.3/i.test(ua)) {operatingSystem = 'Windows 8.1';}
  else if (/windows nt 6\.2/i.test(ua)) {operatingSystem = 'Windows 8';}
  else if (/windows nt 6\.1/i.test(ua)) {operatingSystem = 'Windows 7';}
  else if (/mac os x/i.test(ua)) {
    operatingSystem = 'macOS';
    if (/iphone/i.test(ua)) {operatingSystem = 'iOS (iPhone)';}
    else if (/ipad/i.test(ua)) {operatingSystem = 'iOS (iPad)';}
  } else if (/android/i.test(ua)) {operatingSystem = 'Android';}
  else if (/cros/i.test(ua)) {operatingSystem = 'ChromeOS';}
  else if (/linux/i.test(ua)) {operatingSystem = 'Linux';}

  // 2. Device Type Detection
  if (/ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    deviceType = 'Tablet';
  } else if (/iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    deviceType = 'Mobile';
  } else if (/postmanruntime/i.test(ua) || /curl/i.test(ua) || /insomnia/i.test(ua)) {
    deviceType = 'API Client';
  }

  // 3. Browser Detection
  if (/postmanruntime/i.test(ua)) {
    const match = ua.match(/PostmanRuntime\/([\d.]+)/i);
    browser = match ? `Postman ${match[1]}` : 'Postman';
  } else if (/edg\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/edg\/([\d.]+)/i);
    browser = `Edge ${match[1].split('.')[0]}`;
  } else if (/opr\/([\d.]+)|opera/i.test(ua)) {
    const match = ua.match(/opr\/([\d.]+)/i);
    browser = match ? `Opera ${match[1].split('.')[0]}` : 'Opera';
  } else if (/chrome\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/chrome\/([\d.]+)/i);
    browser = `Chrome ${match[1].split('.')[0]}`;
  } else if (/firefox\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/firefox\/([\d.]+)/i);
    browser = `Firefox ${match[1].split('.')[0]}`;
  } else if (/safari\/([\d.]+)/i.test(ua) && !/chrome/i.test(ua)) {
    const match = ua.match(/version\/([\d.]+)/i);
    browser = match ? `Safari ${match[1].split('.')[0]}` : 'Safari';
  } else if (/curl\/([\d.]+)/i.test(ua)) {
    browser = 'cURL';
  }

  const deviceName = `${deviceType} (${operatingSystem})`;

  return {
    browser,
    operatingSystem,
    deviceType,
    deviceName,
  };
}

module.exports = {
  parseRequestInfo,
  parseUserAgent,
};
