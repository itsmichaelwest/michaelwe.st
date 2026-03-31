"use client";

import { motion, useReducedMotion } from "motion/react";
import { MDXClient } from "next-mdx-remote-client/csr";
import { components } from "../../../components/MDXComponents";
import type { SerializeResult } from "next-mdx-remote-client/serialize";

export function WritingBody({ source }: { source: SerializeResult }) {
    const reducedMotion = useReducedMotion();

    if ("error" in source) return null;

    return (
        <motion.div
            initial={
                reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
            }
            animate={
                reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
            <MDXClient {...source} components={components} />
        </motion.div>
    );
}
