"use client";

import { MDXClient } from "next-mdx-remote-client/csr";
import { components } from "../../../components/MDXComponents";
import type { SerializeResult } from "next-mdx-remote-client/serialize";

export function WritingBody({ source }: { source: SerializeResult }) {
    return <MDXClient {...source} components={components} />;
}
