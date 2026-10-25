import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ─── Admin User ───
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) before seeding");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Ayoub Osama Ayoub",
    },
  });

  // ─── Profile ───
  await prisma.profile.upsert({
    where: { id: "seed-profile" },
    update: {
      title: "Software Engineer · AI Enthusiast · Entrepreneur",
      about:
        "Software Engineer graduated from Üsküdar University, focused on building practical software and AI-powered applications. 1.5 years at a real estate company (sales, client communication, customer relations, negotiation, business operations). Tone: premium, suited to international recruiters and investors.",
    },
    create: {
      id: "seed-profile",
      name: "Ayoub Osama Ayoub",
      title: "Software Engineer · AI Enthusiast · Entrepreneur",
      nationality: "Jordanian",
      locations: "Abu Dhabi, UAE & Istanbul, Türkiye",
      email: adminEmail,
      phones: process.env.SEED_PHONES || "",
      about:
        "Software Engineer graduated from Üsküdar University, focused on building practical software and AI-powered applications. 1.5 years at a real estate company (sales, client communication, customer relations, negotiation, business operations). Tone: premium, suited to international recruiters and investors.",
    },
  });

  // ─── Hero Stats ───
  const heroStats = [
    { label: "Years of Experience", value: "1.5+" },
    { label: "Projects", value: "10+" },
    { label: "Technologies", value: "15+" },
    { label: "Clients", value: "5+" },
  ];
  for (let i = 0; i < heroStats.length; i++) {
    await prisma.heroStat.upsert({
      where: { id: `hero-stat-${i}` },
      update: heroStats[i],
      create: { id: `hero-stat-${i}`, ...heroStats[i], order: i },
    });
  }

  // ─── Skills ───
  const skills = [
    { name: "Python", category: "Languages", level: 90, order: 0 },
    { name: "Java", category: "Languages", level: 75, order: 1 },
    { name: "JavaScript", category: "Languages", level: 85, order: 2 },
    { name: "TypeScript", category: "Languages", level: 80, order: 3 },
    { name: "React", category: "Frontend", level: 85, order: 4 },
    { name: "Next.js", category: "Frontend", level: 80, order: 5 },
    { name: "Node.js", category: "Backend", level: 80, order: 6 },
    { name: "Express", category: "Backend", level: 75, order: 7 },
    { name: "PostgreSQL", category: "Databases", level: 75, order: 8 },
    { name: "SQLite", category: "Databases", level: 70, order: 9 },
    { name: "Docker", category: "DevOps", level: 65, order: 10 },
    { name: "Git", category: "DevOps", level: 85, order: 11 },
    { name: "REST APIs", category: "Backend", level: 85, order: 12 },
    { name: "AI Development", category: "AI", level: 75, order: 13 },
    { name: "Machine Learning", category: "AI", level: 70, order: 14 },
    { name: "Prompt Engineering", category: "AI", level: 85, order: 15 },
    { name: "UI/UX", category: "Design", level: 70, order: 16 },
    { name: "Cloud Computing", category: "DevOps", level: 60, order: 17 },
  ];
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: skill,
      create: {
        id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...skill,
      },
    });
  }

  // ─── Experience ───
  await prisma.experience.upsert({
    where: { id: "seed-exp-0" },
    update: {},
    create: {
      id: "seed-exp-0",
      company: "Real Estate Company",
      role: "Sales & Client Relations Specialist",
      startDate: new Date("2023-01-01"),
      current: true,
      description:
        "Client communication, property sales, marketing, negotiation, customer management, and business operations.",
      order: 0,
    },
  });

  // ─── Education ───
  await prisma.education.upsert({
    where: { id: "seed-edu-0" },
    update: {
      current: false,
      description: "Software Engineer graduated from Üsküdar University.",
    },
    create: {
      id: "seed-edu-0",
      institution: "Üsküdar University",
      degree: "Bachelor",
      field: "Software Engineering",
      startDate: new Date("2021-09-01"),
      current: false,
      description: "Software Engineer graduated from Üsküdar University.",
      order: 0,
    },
  });

  // ─── Services ───
  const services = [
    { title: "Web Development", description: "Modern, responsive web applications using React, Next.js, and Tailwind CSS.", icon: "Globe", order: 0 },
    { title: "AI Applications", description: "AI-powered solutions, LLM integration, prompt engineering, and machine learning models.", icon: "Brain", order: 1 },
    { title: "Backend Development", description: "Scalable APIs, serverless functions, database design, and cloud infrastructure.", icon: "Server", order: 2 },
    { title: "Automation", description: "Workflow automation, data pipelines, and process optimization.", icon: "Zap", order: 3 },
    { title: "API Integration", description: "Third-party API integration, RESTful services, and microservices architecture.", icon: "Link", order: 4 },
    { title: "Database Design", description: "PostgreSQL, SQLite, Prisma ORM, and data modeling.", icon: "Database", order: 5 },
  ];
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: `seed-svc-${service.order}` },
      update: service,
      create: { id: `seed-svc-${service.order}`, ...service },
    });
  }

  // ─── Social Links ───
  const socialLinks = [
    { platform: "LinkedIn", url: "https://linkedin.com/in/ayoubosama", icon: "Linkedin", order: 0 },
    { platform: "GitHub", url: "https://github.com/ayoubosama", icon: "Github", order: 1 },
    { platform: "TikTok", url: "https://tiktok.com/@ayoubosama", icon: "Music2", order: 2 },
    { platform: "Instagram", url: "https://instagram.com/ayouboam", icon: "Instagram", order: 3 },
    { platform: "WhatsApp", url: process.env.SEED_WHATSAPP_URL || "https://wa.me/", icon: "MessageCircle", order: 4 },
    { platform: "X", url: "https://x.com/ayoubosama", icon: "Twitter", order: 5 },
    { platform: "Facebook", url: "https://facebook.com/ayoubosama", icon: "Facebook", order: 6 },
  ];
  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: `seed-social-${link.platform.toLowerCase()}` },
      update: link,
      create: { id: `seed-social-${link.platform.toLowerCase()}`, ...link },
    });
  }

  // ─── Theme Settings ───
  await prisma.themeSettings.upsert({
    where: { id: "seed-theme" },
    update: {},
    create: {
      id: "seed-theme",
      primaryColor: "#0ea5e9",
      secondaryColor: "#8b5cf6",
      accentColor: "#f59e0b",
      backgroundColor: "#0a0a0a",
      textColor: "#fafafa",
      darkMode: true,
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
