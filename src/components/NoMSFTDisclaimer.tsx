import React from 'react'
import PropTypes from 'prop-types'

const NoMSFTDisclaimer = ({ title }) => {
    return (
        <div className="bg-gray-100 px-8 pb-2 pt-1 mb-16">
            <div>
                <h4 className="font-sans text-xl">ℹ️ Not affiliated with Microsoft</h4>
                <p><em>{ title }</em> isn&apos;t affiliated with Microsoft. Concepts and mockups shown do not represent any product plans past, present, or future.</p>
            </div>
        </div>
    )
}

NoMSFTDisclaimer.propTypes = {
    title: PropTypes.string.isRequired
}

export default NoMSFTDisclaimer