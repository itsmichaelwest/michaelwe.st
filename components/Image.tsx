// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import NextImage from 'next/image'

const Image = ({ src, alt, height, width, layout="responsive" }) => {
    const imageProps = {
        src,
        alt,
        height,
        width,
        layout
    }

    return (
        <figure>
            <NextImage {...imageProps} />
            <figcaption>{alt}</figcaption>
        </figure>
    )
}

export default Image