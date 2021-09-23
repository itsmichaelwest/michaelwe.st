import * as React from 'react'
import { Link } from 'gatsby'

type ButtonProps = {
    isInternal: boolean,
    to: string,
    className?: string,
    style?: string
}

const Link2: React.FunctionComponent<ButtonProps> = ({ isInternal, to, className, children }) => {
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

export default Link2