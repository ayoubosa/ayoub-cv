"use client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesProps {
  services: Service[];
}

const iconMap: Record<string, string> = {
  Globe: "🌐", Brain: "🧠", Server: "🖥️", Zap: "⚡", Link: "🔗", Database: "🗄️",
};

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          <span className="text-green-400">My</span> Services
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass rounded-xl p-8 text-center transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="mb-4 text-4xl">{iconMap[service.icon] || "🔧"}</div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
