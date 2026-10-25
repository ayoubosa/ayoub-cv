"use client";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
}

interface ExperienceTimelineProps {
  items: TimelineItem[];
  title: string;
}

export default function ExperienceTimeline({ items, title }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          {title}
        </h2>
        <div className="relative space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-purple-500 md:before:left-1/2 md:before:-translate-x-px">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`relative pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
              }`}
            >
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-blue-400 bg-black md:left-auto md:right-auto md:top-1" />
              <div className="glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="mb-1 text-sm text-blue-400">
                  {new Date(item.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  {" — "}
                  {item.current ? "Present" : item.endDate ? new Date(item.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ""}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.organization}</p>
                <p className="mt-2 text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
