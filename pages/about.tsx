import Image from "next/image";
import Link from "next/link";
import Button from "../components/Button";
import SEO from "../components/SEO";

import PortraitTall from "../public/images/michael-portrait-tall.jpg";
import siteMetadata from "../siteMetadata";

const About = () => (
    <>
        <SEO
            title={`About - ${siteMetadata.title}`}
            description={siteMetadata.description}
            canonical="/about"
        />
        <article className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
            <Image
                className="mb-10 md:mb-16 lg:mb-0 rounded-3xl shadow-xs ring ring-black/5 dark:ring-white/5"
                src={PortraitTall}
                alt="Photo of Michael"
            />
            <section className="space-y-8">
                <section className="text-gray-800 dark:text-gray-200 leading-loose space-y-8">
                    <p>
                        I&apos;m a self-taught designer with an engineering
                        background, specializing in simple and effortless
                        experiences for both the devices we use today and the
                        ones we&apos;ll use in the future. Crafting high-quality
                        products that people love to use is my passion, and I
                        work tirelessly to achieve that goal.
                    </p>
                    <p>
                        Using the medium of motion and rapid prototyping I bring
                        these experiences to life, visualizing the smallest
                        interactions to entire user journeys. I strongly believe
                        in open design, and encourage co-creation that can help
                        deliver a better solution for users.
                    </p>
                    <p>
                        Accessibility and inclusion sit at the center of my
                        process — technology should empower everyone and nobody
                        should be left with a subpar experience.
                    </p>
                    <p>
                        I&apos;m currently a Senior Designer at{" "}
                        <Link href="https://www.microsoft.com/">Microsoft</Link>
                        , where I currently work on Windows AI.
                    </p>
                    <p>
                        Previously a Design Intern at Microsoft, where I was
                        involved with products used by millions of people around
                        the world. Check them out:{" "}
                        <Link
                            href="/work/surface-duo"
                            className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                        >
                            Surface Duo
                        </Link>
                        ,{" "}
                        <Link
                            href="/work/swiftkey-design-system"
                            className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                        >
                            SwiftKey
                        </Link>
                        ,{" "}
                        <Link
                            href="/work/fluent-icons"
                            className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                        >
                            Fluent Icons
                        </Link>
                        . Before that, I worked independently on critically
                        acclaimed concepts both by myself and friends.
                    </p>
                    <p>BSc Computer Science graduate — First Class Honours.</p>
                    <p>
                        Awarded 2018-19{" "}
                        <Link
                            href="https://mvp.microsoft.com/"
                            className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                        >
                            Microsoft MVP
                        </Link>{" "}
                        (Most Valuable Professional) for Windows Design.
                    </p>
                </section>
                <Button to="/files/mw-resume-jan2022.pdf">
                    Download résumé
                </Button>
            </section>
        </article>
    </>
);

export default About;
