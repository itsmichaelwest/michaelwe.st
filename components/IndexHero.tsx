import React from "react";
import SocialIcons from "./SocialIcons";

const IndexHero: React.FC = () => (
    <div className="my-40 space-y-8">
        <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-heading">
            Designer. Developer.
        </h1>
        <SocialIcons />
    </div>
);

export default IndexHero;
