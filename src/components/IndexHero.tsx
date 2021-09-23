import * as React from "react"
import SocialIcons from "./SocialIcons"

export default function IndexHero(): React.ReactElement {
    return (
        <>
            <div className="max-w-prose mt-32 mb-40">
                <h1 className="text-7xl sm:text-8xl font-emoji max-w-max">
                    👋
                </h1>
                <h1 className="text-5xl sm:text-6xl font-display font-semibold my-8 sm:my-12 dark:text-white">
                    Designer. Developer.
                </h1>
                <SocialIcons/>
            </div>
        </>
    )     
}
