import React from 'react'
import Link from 'next/link'

interface ButtonProps {
    to: string,
    style?: string,
    children: any
}

const Button: React.FC<ButtonProps> = ({ to, style, children }) => {
    let bg: string

    if (style === 'onPrimary') {
        bg = 'border-2 border-white text-white hover:bg-white hover:text-black'
    } else {
        bg = 'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white'
    }

    const classes = 'px-6 py-2 inline-block transition-all'

    return (
        <Link href={to}>
            <a className={`${bg} ${classes}`}>
                {children}
            </a>
        </Link>
    )
}

export default Button