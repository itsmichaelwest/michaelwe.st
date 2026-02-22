import type { SerializeResult } from "next-mdx-remote-client/serialize";

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    aspect: number;
    railH: number;
    img?: string;
    canonical?: string | null;
    noMSFT?: boolean;
    year?: string;
    color?: string;
    label?: string;
    officialURL?: string;
    officialURLText?: string;
    paras?: number;
    mdxSource?: SerializeResult;
}

export const SAMPLE_ITEMS: ItemData[] = [
    {
        id: "s1",
        color: "#e74c3c",
        label: "1",
        aspect: 1680 / 1279,
        railH: 0.8,
        title: "Item One",
        subtitle: "Lorem ipsum dolor sit amet",
        paras: 5,
    },
    {
        id: "s2",
        color: "#3498db",
        label: "2",
        aspect: 0.56,
        railH: 1.0,
        title: "Item Two",
        subtitle: "Consectetur adipiscing elit",
        paras: 1,
    },
    {
        id: "s3",
        color: "#2ecc71",
        label: "3",
        aspect: 1.0,
        railH: 0.8,
        title: "Item Three",
        subtitle: "Sed do eiusmod tempor",
        paras: 3,
    },
    {
        id: "s4",
        color: "#f39c12",
        label: "4",
        aspect: 1.33,
        railH: 0.7,
        title: "Item Four",
        subtitle: "Ut enim ad minim veniam",
        paras: 2,
    },
    {
        id: "s5",
        color: "#9b59b6",
        label: "5",
        aspect: 0.56,
        railH: 0.95,
        title: "Item Five",
        subtitle: "Quis nostrud exercitation",
        paras: 6,
    },
    {
        id: "s6",
        color: "#1abc9c",
        label: "6",
        aspect: 1.5,
        railH: 0.65,
        title: "Item Six",
        subtitle: "Duis aute irure dolor",
        paras: 1,
    },
    {
        id: "s7",
        color: "#e67e22",
        label: "7",
        aspect: 1.28,
        railH: 0.75,
        title: "Item Seven",
        subtitle: "Excepteur sint occaecat",
        paras: 4,
    },
    {
        id: "s8",
        color: "#2c3e50",
        label: "8",
        aspect: 0.75,
        railH: 0.9,
        title: "Item Eight",
        subtitle: "Sunt in culpa qui officia",
        paras: 2,
    },
    {
        id: "s9",
        color: "#c0392b",
        label: "9",
        aspect: 1.6,
        railH: 0.55,
        title: "Item Nine",
        subtitle: "Mollit anim id est laborum",
        paras: 7,
    },
    {
        id: "s10",
        color: "#16a085",
        label: "10",
        aspect: 1.0,
        railH: 0.85,
        title: "Item Ten",
        subtitle: "Nemo enim ipsam voluptatem",
        paras: 1,
    },
];
