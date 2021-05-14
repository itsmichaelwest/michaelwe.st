import React from "react"
import SocialIcons from "./SocialIcons"

export default function IndexHero(): React.ReactElement {
    return (
        <>
            <div className="relative w-auto max-w-prose my-40">
                <h1 className="text-8xl font-emoji font-bold max-w-max mb-6">
                    👋
                </h1>
                <h1 className="text-3xl font-header font-semibold leading-tight mb-4 dark:text-white">
                    Designer and developer. Passionate about simple, magical experiences.
                </h1>
                <div className="sm:mt-8 mt-6">
                    <SocialIcons/>
                </div>
            </div>
        </>
    )     
}
