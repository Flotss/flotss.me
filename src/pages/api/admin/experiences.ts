import { prisma } from '@/lib/prisma';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_EXPERIENCES = [
  {
    title: 'Software Engineer',
    company: 'Société Générale',
    location: 'Paris La Défense',
    startDate: 'Sep 2023',
    endDate: 'Present',
    current: true,
    type: 'work',
    description:
      'Engineered ASP.NET Core web applications and dynamic Angular interfaces used by 20+ developers for branch lifecycle, Jira tracking, and real-time SQL monitoring. Automated release cycles and CI/CD pipelines.',
    skills: 'C#, ASP.NET Core, Angular, TypeScript, SQL Server, CI/CD, Git',
    order: 1,
    visible: true,
  },
  {
    title: 'Python Developer',
    company: 'Dalkia (EDF Group)',
    location: 'Nanterre',
    startDate: 'Apr 2023',
    endDate: 'Jul 2023',
    current: false,
    type: 'work',
    description:
      'Engineered redundancy architectures for industrial technical alarms. Designed relational databases and implemented hotline autocomplete systems to accelerate operator workflows.',
    skills: 'Python, PostgreSQL, Database Architecture, Industrial Alarms',
    order: 2,
    visible: true,
  },
  {
    title: 'Engineering Degree / Master in Computer Science',
    company: 'ISEP - École d’ingénieurs du numérique',
    location: 'Paris',
    startDate: '2021',
    endDate: '2024',
    current: false,
    type: 'education',
    description:
      'Specialized in Software Engineering and Distributed Architectures. Developed JavaFX applications, UML schema generator (ObjectAidJava), and enterprise software projects.',
    skills: 'Java, Software Architecture, Algorithms, Distributed Systems',
    order: 3,
    visible: true,
  },
];

export default async function adminExperiencesHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.UserJWT;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing authentication' });
  }

  const payload = await verifyUserJWT(token);
  if (!payload || !payload.admin) {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }

  if (req.method === 'GET') {
    try {
      let experiences = await prisma.experience.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      });

      if (experiences.length === 0) {
        await prisma.experience.createMany({
          data: DEFAULT_EXPERIENCES,
        });
        experiences = await prisma.experience.findMany({
          orderBy: [{ order: 'asc' }, { id: 'asc' }],
        });
      }

      return res.status(200).json(experiences);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to fetch experiences' });
    }
  }

  if (req.method === 'POST') {
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      type,
      description,
      skills,
      order,
      visible,
    } = req.body || {};

    if (!title || !company || !startDate) {
      return res.status(400).json({ message: 'Title, company, and start date are required' });
    }

    try {
      const maxOrderExp = await prisma.experience.findFirst({
        orderBy: { order: 'desc' },
      });
      const nextOrder = typeof order === 'number' ? order : (maxOrderExp?.order || 0) + 1;

      const created = await prisma.experience.create({
        data: {
          title: String(title).trim(),
          company: String(company).trim(),
          location: location ? String(location).trim() : null,
          startDate: String(startDate).trim(),
          endDate: current ? 'Present' : endDate ? String(endDate).trim() : null,
          current: Boolean(current),
          type: type === 'education' ? 'education' : 'work',
          description: description ? String(description).trim() : null,
          skills: skills ? String(skills).trim() : null,
          order: nextOrder,
          visible: visible !== false,
        },
      });

      return res.status(201).json({ success: true, experience: created });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to create experience' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { items, id, ...updateFields } = req.body || {};

    // Support batch update (useful for reordering all experiences)
    if (Array.isArray(items)) {
      try {
        const updates = items.map((item: { id: number; order?: number; visible?: boolean }) =>
          prisma.experience.update({
            where: { id: Number(item.id) },
            data: {
              ...(typeof item.order === 'number' ? { order: item.order } : {}),
              ...(typeof item.visible === 'boolean' ? { visible: item.visible } : {}),
            },
          }),
        );

        await prisma.$transaction(updates);
        return res.status(200).json({ success: true, count: items.length });
      } catch (e: any) {
        return res.status(500).json({ message: e.message || 'Failed to batch update experiences' });
      }
    }

    const expId = Number(id);
    if (isNaN(expId) || expId <= 0) {
      return res.status(400).json({ message: 'Valid experience ID is required' });
    }

    try {
      const updated = await prisma.experience.update({
        where: { id: expId },
        data: {
          ...(typeof updateFields.title === 'string' ? { title: updateFields.title.trim() } : {}),
          ...(typeof updateFields.company === 'string'
            ? { company: updateFields.company.trim() }
            : {}),
          ...(typeof updateFields.location === 'string' || updateFields.location === null
            ? { location: updateFields.location ? updateFields.location.trim() : null }
            : {}),
          ...(typeof updateFields.startDate === 'string'
            ? { startDate: updateFields.startDate.trim() }
            : {}),
          ...(typeof updateFields.endDate === 'string' || updateFields.endDate === null
            ? { endDate: updateFields.endDate ? updateFields.endDate.trim() : null }
            : {}),
          ...(typeof updateFields.current === 'boolean' ? { current: updateFields.current } : {}),
          ...(typeof updateFields.type === 'string' ? { type: updateFields.type } : {}),
          ...(typeof updateFields.description === 'string' || updateFields.description === null
            ? { description: updateFields.description ? updateFields.description.trim() : null }
            : {}),
          ...(typeof updateFields.skills === 'string' || updateFields.skills === null
            ? { skills: updateFields.skills ? updateFields.skills.trim() : null }
            : {}),
          ...(typeof updateFields.order === 'number' ? { order: updateFields.order } : {}),
          ...(typeof updateFields.visible === 'boolean' ? { visible: updateFields.visible } : {}),
        },
      });

      return res.status(200).json({ success: true, experience: updated });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to update experience' });
    }
  }

  if (req.method === 'DELETE') {
    const rawId = req.query.id || req.body?.id;
    const expId = Number(rawId);

    if (isNaN(expId) || expId <= 0) {
      return res.status(400).json({ message: 'Valid experience ID is required' });
    }

    try {
      await prisma.experience.delete({
        where: { id: expId },
      });

      return res.status(200).json({ success: true, deletedId: expId });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to delete experience' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
