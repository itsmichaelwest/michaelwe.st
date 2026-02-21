import clsx from "clsx";
import React from "react";

interface BlockGridProps {
    children: React.ReactNode;
    className?: string;
}

const BlockGrid: React.FC<BlockGridProps> = ({ children, className }) => (
    <section
        className={clsx(
            "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16",
            className && className,
        )}
    >
        {children}
    </section>
);

export default BlockGrid;
