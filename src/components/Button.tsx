import React from "react"
import { Link } from "gatsby"
import PropTypes from 'prop-types'

const Button = ({ className, isInternal, style, to, children }) => {
    let bg: string

    if (style === "onPrimary") {
        bg = "bg-white hover:bg-gray-100"
    } else {
        bg = "bg-blue text-white hover:bg-blue-700"
    }

    const classes = "transition-colors px-6 py-2 rounded inline-block font-body"

    return (
        isInternal 
        ?
        <Link to={to} className={`${bg} ${classes}`}>
            {children}
        </Link>
        :
        <a href={to} className={`${bg} ${classes}`}>
            {children} &rarr;
        </a>
    )
}

Button.propTypes = {
    className: PropTypes.string,
    isInternal: PropTypes.bool,
    style: PropTypes.string,
    to: PropTypes.string,
    children: PropTypes.node
}

export default Button