import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: { name: 'ADMIN' },
    create: { id: 1, name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { id: 2 },
    update: { name: 'USER' },
    create: { id: 2, name: 'USER' },
  });

  console.log('Seeded roles:', { adminRole, userRole });

  const INITIAL_EXPERIENCES = [
    {
      id: 1,
      title: 'Software Engineer (Apprenticeship)',
      company: 'Société Générale',
      location: 'Puteaux (92), France — Hybrid',
      startDate: 'Oct 2023',
      endDate: 'Sep 2026',
      current: true,
      type: 'work',
      description:
        'Full-stack software engineer in a 20-developer squad (long-term projects) operating in an Agile / Scrum framework. Focused on internal tooling, framework migrations, and real-time transaction processing.',
      highlights: JSON.stringify([
        'Release Automation: Built an internal automation tool (Angular / ASP.NET Core) transitioning from a 10-minute manual process to a 3-click workflow, slashing release overhead by -90% per weekly release.',
        'Architecture Migration: Full migration of a legacy C# Framework application to a modern web architecture, used daily by 20 developers for Git branch lifecycle, release promotions, and Jira ticket synchronization.',
        'P&L Volatility Engine: Engineered financial computation module (ingesting 180MB raw files, multi-source aggregation, complex financial formulas), automating a 2-day monthly manual process (-2 days/month).',
        'Real-Time Transactions: Migrated from snapshot architecture to real-time transactional processing (book & transaction views), eliminating raw database storage and refining analytics granularity.',
        'IRS Data Stream: Enriched Interest Rate Swap (IRS) streams with dual legs across snapshot and real-time views, distributed uniformly across downstream modules.',
        'SQL Monitoring: Developed a real-time SQL monitoring and query profiling tool to detect, analyze, and terminate blocking database queries for the team.',
      ]),
      skills:
        'Angular, ASP.NET Core, C#, .NET 8, SQL Server, Oracle, Git, Jira, Jenkins, Agile / Scrum',
      logoUrl: '/images/societe-general.png',
      order: 1,
      visible: true,
    },
    {
      id: 2,
      title: 'Master of Engineering in Computer Science',
      company: 'ISEP — École d’ingénieurs du numérique',
      location: 'Paris & Issy-les-Moulineaux, France',
      startDate: 'Oct 2023',
      endDate: 'Sep 2026',
      current: true,
      type: 'education',
      description:
        'Major in Software Engineering (Génie Logiciel). Advanced curriculum covering software engineering, distributed systems, domain-driven design, and enterprise application architectures.',
      highlights: JSON.stringify([
        'HealthPocket: Built a mobile health management application for appointments, medication reminders, and doctor interactions with multi-language support and bi-directional offline/online database synchronization.',
        'Facebook Like: Developed a full-featured Facebook clone using Blazor and .NET 8 with real-time peer notifications via SignalR, friend management, posts feed, and a Neo4j graph database backend.',
        'Engineering Methodologies: Mastered TDD, BDD, and DDD methodologies, distributed computing concepts (gRPC, WebSockets, Cassandra), and Spring Boot enterprise architectures.',
      ]),
      skills:
        'Java, Spring Boot, C#, Blazor, .NET 8, SignalR, Neo4j, TDD / BDD / DDD, gRPC, Distributed Systems',
      logoUrl: '/images/isep.svg',
      order: 2,
      visible: true,
    },
    {
      id: 3,
      title: 'International Exchange — Systems Modeling',
      company: 'Hanze University of Applied Sciences',
      location: 'Groningen, Netherlands',
      startDate: 'Feb 2026',
      endDate: 'Apr 2026',
      current: false,
      type: 'education',
      description:
        'International academic exchange semester focused on systems modeling, architectural simulations, and engineering collaboration in an international environment.',
      highlights: JSON.stringify([
        'Explored advanced systems modeling and architectural simulations.',
        'Collaborated in multicultural engineering squads on complex domain models.',
      ]),
      skills: 'Systems Modeling, Software Architecture, International Engineering',
      logoUrl: '/images/hanze.svg',
      order: 3,
      visible: true,
    },
    {
      id: 4,
      title: 'Web Developer (Internship)',
      company: 'Dalkia (EDF Group)',
      location: 'Pulnoy (54), France',
      startDate: 'Feb 2023',
      endDate: 'Apr 2023',
      current: false,
      type: 'work',
      description:
        '10-week technical internship within the industrial facility safety & monitoring department.',
      highlights: JSON.stringify([
        'Developed a redundant failover architecture for transmitting mission-critical technical alarms (Python, JavaScript, PHP).',
        'Designed the relational database schema and built the associated web platform.',
        'Implemented an intelligent autocomplete feature for hotline operator documentation, significantly accelerating emergency lookup response times.',
      ]),
      skills: 'Python, PostgreSQL, SQL, JavaScript, Linux, Database Architecture',
      logoUrl: '/images/dalkia.svg',
      order: 4,
      visible: true,
    },
    {
      id: 5,
      title: 'DUT in Computer Science (Two-Year University Degree)',
      company: 'IUT Nancy-Charlemagne — Université de Lorraine',
      location: 'Nancy, France',
      startDate: 'Sep 2021',
      endDate: 'Jun 2023',
      current: false,
      type: 'education',
      description:
        'Intensive two-year university degree in computer science. Validated in 2 years (from BUT program) to directly enter engineering school and accelerate the career timeline.',
      highlights: JSON.stringify([
        'Mastered rigorous algorithmic design and computational problem-solving on paper before machine implementation.',
        'Extensive Java development across CLI tools, desktop interfaces (JavaFX), and core OOP architectures.',
        'ObjectAidJava: Designed and developed a full JavaFX desktop application for automatic UML class diagram generation with dynamic relation positioning.',
        'Acquired deep fundamentals in relational databases, SQL, data structures, and Unix environments.',
      ]),
      skills: 'Java, JavaFX, Algorithms, Data Structures, OOP, SQL, UML, Git',
      logoUrl: '/images/iut-charlemagne.png',
      order: 5,
      visible: true,
    },
  ];

  for (const exp of INITIAL_EXPERIENCES) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp,
    });
  }
  console.log('Seeded experiences');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
