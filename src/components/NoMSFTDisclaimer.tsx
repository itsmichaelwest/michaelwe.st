import React from 'react'
import PropTypes from 'prop-types'

const NoMSFTDisclaimer = ({ title }) => {
    return (
        <div className="bg-gray-100 px-8 pb-2 pt-1 mb-16">
            <div>
                <h4 className="font-header text-xl flex flex-row">
                    <span className="inline-block w-6 h-6 mr-2">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1.99896C17.5237 1.99896 22.0015 6.47681 22.0015 12.0005C22.0015 17.5242 17.5237 22.0021 12 22.0021C6.47629 22.0021 1.99844 17.5242 1.99844 12.0005C1.99844 6.47681 6.47629 1.99896 12 1.99896ZM12 3.49896C7.30472 3.49896 3.49844 7.30524 3.49844 12.0005C3.49844 16.6958 7.30472 20.5021 12 20.5021C16.6953 20.5021 20.5015 16.6958 20.5015 12.0005C20.5015 7.30524 16.6953 3.49896 12 3.49896ZM11.9964 10.4995C12.376 10.4993 12.69 10.7812 12.7399 11.1473L12.7468 11.2491L12.7504 16.7506C12.7507 17.1649 12.4151 17.5009 12.0009 17.5011C11.6212 17.5014 11.3073 17.2194 11.2574 16.8534L11.2504 16.7516L11.2468 11.25C11.2466 10.8358 11.5821 10.4998 11.9964 10.4995ZM12.0004 7.00178C12.552 7.00178 12.9991 7.4489 12.9991 8.00044C12.9991 8.55199 12.552 8.99911 12.0004 8.99911C11.4489 8.99911 11.0018 8.55199 11.0018 8.00044C11.0018 7.4489 11.4489 7.00178 12.0004 7.00178Z"/>
                        </svg>
                    </span>
                    Not affiliated with Microsoft
                </h4>
                <p><em>{ title }</em> isn&apos;t affiliated with Microsoft. Concepts and mockups shown do not represent any product plans past, present, or future.</p>
            </div>
        </div>
    )
}

NoMSFTDisclaimer.propTypes = {
    title: PropTypes.string.isRequired
}

export default NoMSFTDisclaimer