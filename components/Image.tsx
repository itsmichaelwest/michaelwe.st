import NextImage from "next/image";
import type { FC } from "react";

interface ImageProps {
    src: string;
    alt: string;
    height?: number;
    width?: number;
}

const Image: FC<ImageProps> = ({ src, alt, height, width }) => {
    return (
        <figure>
            <NextImage src={src} alt={alt} height={height} width={width} />
            <figcaption>{alt}</figcaption>
        </figure>
    );
};

export default Image;
