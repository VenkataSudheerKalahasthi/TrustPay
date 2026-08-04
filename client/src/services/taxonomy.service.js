import api from './api';

export const taxonomyService = {
  async getTaxonomies() {
    const res = await api.get('/taxonomies');
    return res.data.data;
  },
};
