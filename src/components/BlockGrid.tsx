import * as React from 'react'
import WorkBlock from './WorkBlock'

type BlockGridProps = {
    data: any,
    className?: string
}

const BlockGrid: React.FunctionComponent<BlockGridProps> = ({ data, className }) => {
    const blocks = data
                    .filter(edge => !!edge.node.frontmatter.date)
                    .map(edge => <WorkBlock key={edge.node.id} post={edge.node} /> )

    return (
        <section className={`grid grid-cols-1 md:grid-cols-2 ${className ? ` ${className}` : ``}`}>
            {blocks}
        </section>
    )
}

export default BlockGrid