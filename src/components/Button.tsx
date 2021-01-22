import React from "react"
import { Link } from "gatsby"
import PropTypes from 'prop-types'

const Button = ({ isInternal, style, to, children }) => {
    let bg: string

    if (style === "onPrimary") {
        bg = "bg-white hover:bg-gray-100"
    } else {
        bg = "bg-blue text-white hover:bg-blue-700"
    }

    return (
        isInternal 
        ?
        <Link to={to} className={`${bg} transition-colors px-8 py-4 my-8 rounded inline-block font-body`}>
            {children}
        </Link>
        :
        <a href={to} className={`${bg} transition-colors px-8 py-4 my-8 rounded inline-block font-body`}>
            {children} &rarr;
        </a>
    )
}

Button.propTypes = {
    isInternal: PropTypes.bool,
    style: PropTypes.string,
    to: PropTypes.string,
    children: PropTypes.node
}

export default Button