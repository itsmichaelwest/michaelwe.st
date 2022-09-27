import React from 'react'

interface BlockGridProps {
    children: any
    className?: string
}

const BlockGrid: React.FC<BlockGridProps> = ({ children, className }) => (
    <section className={`grid grid-cols-1 md:grid-cols-2 ${className ? ` ${className}` : ``}`}>
        {children}
    </section>
)

export default BlockGrid