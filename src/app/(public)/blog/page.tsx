import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Ayoub Osama Ayoub",
  description: "Read articles about software engineering, AI, and technology.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: { category: true, tags: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <h1 className="mb-2 text-4xl font-bold">Blog</h1>
      <p className="mb-12 text-gray-400">Thoughts on software engineering, AI, and building things.</p>
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}`}
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/20"
          >
            {cat.name} ({cat._count.posts})
          </Link>
        ))}
      </div>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="glass rounded-xl p-8 transition-all hover:scale-[1.01]">
            <div className="mb-2 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-gray-400">{post.excerpt}</p>
            )}
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
