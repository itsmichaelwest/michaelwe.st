import type { SerializeResult } from "next-mdx-remote-client/serialize";

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    aspect: number;
    railH: number;
    img?: string;
    imgAlt?: string;
    canonical?: string | null;
    noMSFT?: boolean;
    year?: string;
    color?: string;
    label?: string;
    officialURL?: string;
    officialURLText?: string;
    mdxSource?: SerializeResult;
}
