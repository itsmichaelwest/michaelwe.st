import * as React from 'react'
import { Link } from 'gatsby'

type AutoLinkProps = {
    isInternal: boolean,
    to: string,
    className?: string,
    style?: string
}

const AutoLink: React.FunctionComponent<AutoLinkProps> = ({ isInternal, to, className, children }) => {
    return (
        <>
        {
            isInternal ?
            <Link to={to} className={className}>
                {children}
            </Link>
            :
            <a href={to} className={className}>
                {children}
            </a>
        }
        </>
    )
}

export default AutoLink