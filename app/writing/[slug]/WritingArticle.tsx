"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { format } from "date-fns";
import { WritingBody } from "./WritingBody";
import type { SerializeResult } from "next-mdx-remote-client/serialize";

interface WritingArticleProps {
    title: string;
    date: string;
    readingTime: number;
    mdxSource: SerializeResult;
}

export function WritingArticle({
    title,
    date,
    readingTime,
    mdxSource,
}: WritingArticleProps) {
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
                    href="/writing"
                    className="text-sm text-muted hover:text-secondary transition-colors duration-200"
                >
                    &larr; Writing
                </Link>
            </motion.div>

            <motion.header
                className="mt-8 mb-12"
                initial={initial(8)}
                animate={animate}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            >
                <h1 className="text-3xl font-semibold tracking-tight text-heading text-balance">
                    {title}
                </h1>
                <p className="mt-3 text-sm text-muted">
                    {date && format(new Date(date), "MMMM d, yyyy")}
                    {" · "}
                    {readingTime} min read
                </p>
            </motion.header>

            <article className="mt-12">
                <WritingBody source={mdxSource} />
            </article>
        </main>
    );
}
