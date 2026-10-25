import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      image: post.ogImage || post.coverImage,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    include: { category: true, tags: true },
  });

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Ayoub Osama Ayoub",
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link href="/blog" className="mb-8 block text-sm text-blue-400 hover:underline">
        ← Back to blog
      </Link>
      <article>
        <div className="mb-4 text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.category && <> · {post.category.name}</>}
        </div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose prose-invert prose-lg mt-10 max-w-none whitespace-pre-wrap text-gray-300">
          {post.content}
        </div>
      </article>
    </div>
  );
}
