'use strict';

const analyticsRepository = require('./analytics.repository');

class ForecastService {
  async generateForecast(data) {
    const model = await analyticsRepository.createForecastModel({
      name: data.name,
      type: data.type || 'REVENUE',
      algorithm: data.algorithm || 'LINEAR_REGRESSION',
      confidence: data.confidence || 95.0,
    });

    const baseVal = data.type === 'WORKFORCE' ? 80 : data.type === 'MARKETPLACE' ? 500000 : 150000;
    const periods = ['Month +1', 'Month +2', 'Quarter +1', 'Quarter +2'];

    for (let i = 0; i < periods.length; i++) {
      const growthMultiplier = 1 + (i + 1) * 0.08;
      const projected = Math.round(baseVal * growthMultiplier);
      const lower = Math.round(projected * 0.92);
      const upper = Math.round(projected * 1.08);

      await analyticsRepository.createForecastResult(model.id, periods[i], projected, lower, upper);
    }

    return analyticsRepository.findForecastModels().then((models) => models.find((m) => m.id === model.id));
  }

  async getForecastModels() {
    return analyticsRepository.findForecastModels();
  }
}

module.exports = new ForecastService();
