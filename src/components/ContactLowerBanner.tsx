import React from 'react'
import Button from './Button'

export default function ContactLowerBanner() {
    return (
        <div className="bg-gray-100">
            <div className="p-16">
                <div className="lg:w-6/12 lg:pr-16">
                    <h2 className="text-black text-2xl font-header font-semibold md:mb-4 mb-2">
                        Let&apos;s work together
                    </h2>
                    <p className="text-gray-800 font-body font-light leading-relaxed tracking-tight mb-4">
                        I&apos;m looking for new opportunities starting summer 2021. If you think I&apos;d be a good fit for your design team, get in touch — it could be the start of something great!
                    </p>
                    <Button isInternal={true} style="onPrimary" to='/about'>
                        About
                    </Button>
                </div>
            </div>
        </div>
    )    
}
