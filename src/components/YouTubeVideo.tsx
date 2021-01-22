import React from 'react'
import PropTypes from 'prop-types'

const YouTubeVideo = ({ videoSrcUrl, videoTitle }) => (
    <div className="relative w-full h-80 my-8">
        <iframe
            className="relative w-full h-full"
            src={videoSrcUrl}
            title={videoTitle}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
        />
    </div>
)

YouTubeVideo.propTypes = {
    videoSrcUrl: PropTypes.string,
    videoTitle: PropTypes.string
}

export default YouTubeVideo