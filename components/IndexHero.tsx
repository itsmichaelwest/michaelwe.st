import React from "react";
import SocialIcons from "./SocialIcons";

const IndexHero = () => (
    <div className="max-w-prose mt-32 mb-40">
        <h1 className="text-7xl sm:text-8xl font-emoji max-w-max">👋</h1>
        <h1 className="text-5xl sm:text-6xl font-display font-semibold tracking-tight my-8 sm:my-12 text-gray-900 dark:text-gray-100">
            Designer. Developer.
        </h1>
        <SocialIcons />
    </div>
);

export default IndexHero;
