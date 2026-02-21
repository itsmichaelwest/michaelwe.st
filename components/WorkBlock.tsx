import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

interface WorkBlockProps {
    title: string;
    url: string;
    description?: string;
    image?: string;
    imageAlt?: string;
}

const WorkBlock: React.FC<WorkBlockProps> = ({
    title,
    url,
    description,
    image,
    imageAlt,
}) => {
    return (
        <div className="flex flex-col gap-4 select-none">
            <Link href={url}>
                <Image
                    src={image}
                    alt={imageAlt}
                    width={1500}
                    height={1500}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[3/2] object-cover rounded-2xl shadow-xs ring ring-black/5"
                />
            </Link>
            <div className="flex flex-col gap-1">
                <Link className="w-fit" href={url}>
                    <h2 className="text-xl font-semibold">{title}</h2>
                </Link>
                <p className="text-muted">{description}</p>
            </div>
        </div>
    );
};

export default WorkBlock;
