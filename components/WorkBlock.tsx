import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface WorkBlockProps {
    title: string
    url: string
    description?: string,
    image?: string,
    imageAlt?: string
}

const WorkBlock: React.FC<WorkBlockProps> = ({ title, url, description, image, imageAlt }) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            className="relative"
            style={{ aspectRatio: "1" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
                <Link href={url} className="absolute inset-0 w-full h-full">
                    <span className="sr-only">
                        {title}
                    </span>
                    <Image src={image} alt={imageAlt} width={1500} height={1500} className="w-full h-full object-cover" />
                    <AnimatePresence>
                        { hover && 
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className="absolute inset-0 p-8 md:p-16 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur">
                                    <h2 className="font-display font-semibold tracking-tight text-gray-900 dark:text-gray-100 text-4xl xl:text-6xl">
                                        {title}
                                    </h2>
                                    <p className="font-text text-gray-600 dark:text-gray-500 xl:text-xl max-w-prose mt-4">
                                        {description}
                                    </p>
                            </motion.div>
                        }
                    </AnimatePresence>
                </Link>
        </div>
    )
}

export default WorkBlock
