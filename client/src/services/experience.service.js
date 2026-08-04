export const experienceService = {
  trackInteraction: (eventName, payload = {}) => {
    // eslint-disable-next-line no-console
    console.log(`[ExperienceTelemetry] ${eventName}`, payload);
  },
};
