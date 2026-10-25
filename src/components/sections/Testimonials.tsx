"use client";

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  avatar?: string | null;
  rating?: number | null;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          <span className="text-yellow-400">Client</span> Testimonials
        </h2>
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass flex-shrink-0 snap-center rounded-xl p-8 md:w-[500px]"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  {(t.role || t.company) && (
                    <div className="text-sm text-gray-400">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-300">&ldquo;{t.content}&rdquo;</p>
              {t.rating && (
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating! ? "text-yellow-400" : "text-gray-600"}>
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
