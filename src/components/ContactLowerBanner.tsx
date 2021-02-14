import React from "react"
import Button from "./Button"

export default function ContactLowerBanner() {
  return (
    <div className="bg-gray-700">
      <div className="max-w-screen-xl sm:mx-auto sm:px-32 mx-8 lg:py-24 py-16">
        <div className="lg:w-6/12">
          <h2 className="text-white text-4xl my-6 ">
            Let&apos;s work together
          </h2>
          <p className="
          text-gray-100 
          text-lg 
          font-body 
          font-light 
          leading-relaxed 
          tracking-tight">
            I&apos;m looking for new opportunities starting summer 2021. If you think I&apos;d be a good fit for your design team, get in touch — it could be the start of something great!
          </p>
          <Button isInternal={true} style="onPrimary" to='/about/'>
            Contact
          </Button>
        </div>
      </div>
    </div>
  )
}