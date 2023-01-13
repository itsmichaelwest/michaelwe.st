import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface WorkBlockProps {
    title: string
    url: string
    description?: string,
    image?: string,
    imageAlt?: string
}

const WorkBlock: React.FC<WorkBlockProps> = ({ title, url, description, image, imageAlt }) => (
    <section className="relative" style={{ aspectRatio: "1" }}>
        <Link href={url} className="absolute inset-0 group w-full h-full">
            <span className="sr-only">
                {title}
            </span>
            <Image src={image} alt={imageAlt} width={1500} height={1500} className="w-full h-full object-cover" />
            <div className="absolute inset-0 p-8 md:p-16 z-10 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <h2 className="font-display font-semibold text-4xl xl:text-6xl">
                    {title}
                </h2>
                <p className="font-text text-gray-600 xl:text-xl max-w-prose mt-4">
                    {description}
                </p>
            </div>
        </Link>
    </section>
)

export default WorkBlock
