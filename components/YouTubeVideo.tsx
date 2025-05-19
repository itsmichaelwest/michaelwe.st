import type { FC } from "react";

interface YouTubeVideoProps {
    videoSrcUrl: string;
    videoTitle: string;
}

const YouTubeVideo: FC<YouTubeVideoProps> = ({ videoSrcUrl, videoTitle }) => (
    <div className="relative" style={{ paddingBottom: "56.5%" }}>
        <div className="absolute inset-0 w-full h-full">
            <iframe
                className="relative w-full h-full"
                src={videoSrcUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    </div>
);

export default YouTubeVideo;
