"use client";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const grouped: Record<string, Skill[]> = {};
  for (const s of skills) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }

  return (
    <section id="skills" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Skills & <span className="text-purple-400">Expertise</span>
        </h2>
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="mb-6 text-xl font-semibold text-gray-200">{category}</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="group glass rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
