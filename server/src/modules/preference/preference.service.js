'use strict';

const prisma = require('../../config/database');

class PreferenceService {
  /**
   * Get User Preferences
   */
  async getUserPreferences(userId) {
    let pref = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.userPreference.create({
        data: {
          userId,
          theme: 'DARK',
          language: 'en',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12H',
          activityVisibility: 'PUBLIC',
        },
      });
    }

    return pref;
  }

  /**
   * Update User Preferences
   */
  async updateUserPreferences(userId, data) {
    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}

module.exports = new PreferenceService();
