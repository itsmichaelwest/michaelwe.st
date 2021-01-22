import React from 'react'
import PropTypes from 'prop-types'

const NoMSFTDisclaimer = ({ title }) => {
    return (
        <div className="bg-gray-100 px-8 py-2 mb-16 rounded-lg">
            <div>
                <h4 className="font-sans text-xl">‼️ Not affiliated with Microsoft</h4>
                <p><em>{ title }</em> isn&apos;t affiliated with Microsoft. Concepts and mockups shown do not represent any product plans past, present, or future.</p>
            </div>
        </div>
    )
}

NoMSFTDisclaimer.propTypes = {
    title: PropTypes.string.isRequired
}

export default NoMSFTDisclaimer