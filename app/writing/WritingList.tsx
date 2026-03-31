"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { format } from "date-fns";
import type { IWritingPost } from "../../lib/writing";

export function WritingList({ posts }: { posts: IWritingPost[] }) {
    const reducedMotion = useReducedMotion();

    const initial = (y: number) =>
        reducedMotion ? { opacity: 0 } : { opacity: 0, y };
    const animate = reducedMotion
        ? { opacity: 1 }
        : { opacity: 1, y: 0 };

    return (
        <main className="mx-auto max-w-[65ch] px-6 py-16">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <Link
                    href="/"
                    className="text-sm text-muted hover:text-secondary transition-colors duration-200"
                >
                    &larr; Home
                </Link>
            </motion.div>

            <motion.h1
                className="mt-4 text-3xl font-semibold tracking-tight text-heading"
                initial={initial(6)}
                animate={animate}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.03 }}
            >
                Writing
            </motion.h1>

            {posts.length === 0 ? (
                <p className="mt-8 text-muted">Nothing here yet.</p>
            ) : (
                <ul className="mt-8">
                    {posts.map((post, i) => (
                        <motion.li
                            key={post.slug}
                            initial={initial(6)}
                            animate={animate}
                            transition={{
                                duration: 0.35,
                                ease: "easeOut",
                                delay: 0.06 + Math.min(i * 0.05, 0.4),
                            }}
                        >
                            <Link
                                href={`/writing/${post.slug}`}
                                className="group block -mx-3 px-3 py-4 rounded-lg transition-colors duration-150 hover:bg-gray-50"
                            >
                                <h2 className="font-medium text-heading">
                                    {post.title}
                                </h2>
                                {post.description && (
                                    <p className="mt-1 text-sm text-secondary line-clamp-2">
                                        {post.description}
                                    </p>
                                )}
                                <p className="mt-1 text-sm text-muted">
                                    {post.date &&
                                        format(
                                            new Date(post.date),
                                            "MMMM d, yyyy",
                                        )}
                                    {" · "}
                                    {post.readingTime} min read
                                </p>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            )}
        </main>
    );
}
