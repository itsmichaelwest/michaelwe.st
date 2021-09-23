import * as React from 'react'
import Button from './Button'

export default function ContactLowerBanner(): React.ReactElement {
    return (
        <section className="bg-gray-800 text-white p-8 sm:p-16">
            <h2 className="font-display text-4xl font-semibold">
                Let&apos;s work together
            </h2>
            <p className="font-text my-4">
                I&apos;m looking for new opportunities starting summer 2021. If you think I&apos;d be a good fit for your design team, get in touch — it could be the start of something great!
            </p>
            <Button isInternal={true} to="/about" style="onPrimary">
                About
            </Button>
        </section>
    )    
}
