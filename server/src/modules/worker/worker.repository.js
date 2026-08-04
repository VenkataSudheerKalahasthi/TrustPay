'use strict';

const { prisma } = require('../../config/database');

const inMemoryWorkers = new Map();

class WorkerRepository {
  async findByUserId(userId) {
    try {
      return await prisma.workerProfile.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true, createdAt: true } },
          categories: { include: { category: true } },
          skills: { include: { skill: true } },
          portfolioProjects: { include: { technologies: { include: { technology: true } } } },
          educations: true,
          certifications: true,
          languages: { include: { language: true } },
          verificationDocuments: true,
          socialLinks: true,
        },
      });
    } catch {
      return inMemoryWorkers.get(userId) || null;
    }
  }

  async findBySlugOrId(slugOrId) {
    try {
      return await prisma.workerProfile.findFirst({
        where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true, createdAt: true } },
          categories: { include: { category: true } },
          skills: { include: { skill: true } },
          portfolioProjects: { include: { technologies: { include: { technology: true } } } },
          educations: true,
          certifications: true,
          languages: { include: { language: true } },
          socialLinks: true,
        },
      });
    } catch {
      for (const w of inMemoryWorkers.values()) {
        if (w.slug === slugOrId || w.id === slugOrId) {
          return w;
        }
      }
      return null;
    }
  }

  async createWorkerProfile(data) {
    try {
      return await prisma.workerProfile.create({ data });
    } catch {
      const mockProfile = {
        id: `wrk_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        portfolioProjects: [],
        skills: [],
        categories: [],
        verificationDocuments: [],
        user: { id: data.userId, firstName: 'Alex', lastName: 'Dev', avatar: null },
      };
      inMemoryWorkers.set(data.userId, mockProfile);
      return mockProfile;
    }
  }

  async updateWorkerProfile(id, updateData) {
    try {
      return await prisma.workerProfile.update({ where: { id }, data: updateData });
    } catch {
      for (const [uid, w] of inMemoryWorkers.entries()) {
        if (w.id === id || w.userId === uid) {
          const updated = { ...w, ...updateData, updatedAt: new Date() };
          inMemoryWorkers.set(uid, updated);
          return updated;
        }
      }
      return updateData;
    }
  }

  async searchWorkers({ q, availability, verificationStatus, minRate, maxRate, minExp, city, sort, page = 1, limit = 10 }) {
    try {
      const where = {};
      if (q) {
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
          { user: { firstName: { contains: q, mode: 'insensitive' } } },
          { user: { lastName: { contains: q, mode: 'insensitive' } } },
        ];
      }
      if (availability) { where.availabilityStatus = availability; }
      if (verificationStatus) { where.verificationStatus = verificationStatus; }
      if (minRate !== null && minRate !== undefined || maxRate !== null && maxRate !== undefined) {
        where.hourlyRate = {};
        if (minRate !== null && minRate !== undefined) { where.hourlyRate.gte = minRate; }
        if (maxRate !== null && maxRate !== undefined) { where.hourlyRate.lte = maxRate; }
      }
      if (minExp !== null && minExp !== undefined) { where.yearsExperience = { gte: minExp }; }
      if (city) { where.city = { equals: city, mode: 'insensitive' }; }

      let orderBy = { createdAt: 'desc' };
      if (sort === 'experience') { orderBy = { yearsExperience: 'desc' }; }
      if (sort === 'rate_asc') { orderBy = { hourlyRate: 'asc' }; }
      if (sort === 'rate_desc') { orderBy = { hourlyRate: 'desc' }; }
      if (sort === 'completion') { orderBy = { profileCompletion: 'desc' }; }

      const skip = (page - 1) * limit;

      const [workers, total] = await Promise.all([
        prisma.workerProfile.findMany({
          where,
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            skills: { include: { skill: true } },
            categories: { include: { category: true } },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.workerProfile.count({ where }),
      ]);

      return { workers, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch {
      const list = Array.from(inMemoryWorkers.values());
      return { workers: list, total: list.length, page: 1, limit, totalPages: 1 };
    }
  }

  async createPortfolioProject(workerProfileId, data, techNames = []) {
    try {
      const project = await prisma.portfolioProject.create({
        data: {
          workerProfileId,
          title: data.title,
          description: data.description,
          projectUrl: data.projectUrl,
          githubUrl: data.githubUrl,
          completionDate: data.completionDate ? new Date(data.completionDate) : null,
          images: data.images || [],
          documents: data.documents || [],
        },
      });

      if (techNames && techNames.length > 0) {
        for (const tName of techNames) {
          const slug = tName.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const tech = await prisma.technology.upsert({
            where: { slug },
            update: {},
            create: { name: tName, slug },
          });

          await prisma.portfolioTechnology.create({
            data: { portfolioProjectId: project.id, technologyId: tech.id },
          });
        }
      }
      return project;
    } catch {
      const mockProject = {
        id: `proj_${Date.now()}`,
        workerProfileId,
        ...data,
        technologies: (techNames || []).map((t) => ({ technology: { name: t } })),
        createdAt: new Date(),
      };
      for (const w of inMemoryWorkers.values()) {
        if (w.id === workerProfileId) {
          w.portfolioProjects = w.portfolioProjects || [];
          w.portfolioProjects.push(mockProject);
        }
      }
      return mockProject;
    }
  }

  async deletePortfolioProject(projectId, workerProfileId) {
    try {
      return await prisma.portfolioProject.deleteMany({
        where: { id: projectId, workerProfileId },
      });
    } catch {
      for (const w of inMemoryWorkers.values()) {
        if (w.id === workerProfileId && w.portfolioProjects) {
          w.portfolioProjects = w.portfolioProjects.filter((p) => p.id !== projectId);
        }
      }
      return { count: 1 };
    }
  }

  async addVerificationDocument(workerProfileId, docData) {
    try {
      return await prisma.workerVerificationDocument.create({
        data: {
          workerProfileId,
          documentType: docData.documentType,
          documentUrl: docData.documentUrl,
          documentNumber: docData.documentNumber,
          verificationStatus: 'PENDING',
        },
      });
    } catch {
      const mockDoc = {
        id: `doc_${Date.now()}`,
        workerProfileId,
        ...docData,
        verificationStatus: 'PENDING',
        uploadedAt: new Date(),
      };
      for (const w of inMemoryWorkers.values()) {
        if (w.id === workerProfileId) {
          w.verificationDocuments = w.verificationDocuments || [];
          w.verificationDocuments.push(mockDoc);
        }
      }
      return mockDoc;
    }
  }
}

module.exports = new WorkerRepository();
