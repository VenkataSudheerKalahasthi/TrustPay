'use strict';

const { prisma } = require('../../config/database');

const MOCK_CATEGORIES = [
  { id: 'cat_1', name: 'Web Development', slug: 'web-development', icon: 'Code' },
  { id: 'cat_2', name: 'Mobile App Development', slug: 'mobile-development', icon: 'Smartphone' },
  { id: 'cat_3', name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'Palette' },
  { id: 'cat_4', name: 'DevOps & Cloud', slug: 'devops-cloud', icon: 'Server' },
  { id: 'cat_5', name: 'Data Science & AI', slug: 'data-science-ai', icon: 'Brain' },
];

const MOCK_SKILLS = [
  { id: 'sk_1', name: 'React.js', slug: 'react-js', category: 'Web Development' },
  { id: 'sk_2', name: 'Node.js', slug: 'node-js', category: 'Web Development' },
  { id: 'sk_3', name: 'TypeScript', slug: 'typescript', category: 'Web Development' },
  { id: 'sk_4', name: 'Python', slug: 'python', category: 'Data Science & AI' },
  { id: 'sk_5', name: 'Flutter', slug: 'flutter', category: 'Mobile App Development' },
];

class TaxonomyRepository {
  async getAllCategories() {
    try {
      return await prisma.category.findMany({ orderBy: { name: 'asc' } });
    } catch {
      return MOCK_CATEGORIES;
    }
  }

  async getAllSkills() {
    try {
      return await prisma.skill.findMany({ orderBy: { name: 'asc' } });
    } catch {
      return MOCK_SKILLS;
    }
  }

  async getAllTechnologies() {
    try {
      return await prisma.technology.findMany({ orderBy: { name: 'asc' } });
    } catch {
      return [];
    }
  }

  async getAllLanguages() {
    try {
      return await prisma.language.findMany({ orderBy: { name: 'asc' } });
    } catch {
      return [];
    }
  }

  async seedDefaultTaxonomies() {
    try {
      const count = await prisma.category.count();
      if (count > 0) { return; }

      for (const cat of MOCK_CATEGORIES) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: { name: cat.name, slug: cat.slug, icon: cat.icon },
        });
      }

      for (const sk of MOCK_SKILLS) {
        await prisma.skill.upsert({
          where: { slug: sk.slug },
          update: {},
          create: { name: sk.name, slug: sk.slug, category: sk.category },
        });
      }
    } catch {
      // ignore database connection errors when running in dev/preview
    }
  }
}

module.exports = new TaxonomyRepository();
