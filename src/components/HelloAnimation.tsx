import React, { createRef, useEffect } from "react"
import lottie from "lottie-web"
import animation from "../animations/hello.json"

import "../styles/lottie.scss"

const HelloAnimation = ()  => {
    let animationContainer = createRef<HTMLDivElement>()

    useEffect(() => {
        const anim = lottie.loadAnimation({
            container: animationContainer.current,
            animationData: animation,
            renderer: 'svg',
            autoplay: false,
            loop: false,
        })
        if (!sessionStorage.getItem('home-played')) {
            setTimeout(() => {
                anim.play()
                sessionStorage.setItem('home-played', 'true')
            }, 500)
        } else {
            anim.goToAndStop(230, true)
        }

        return () => anim.destroy()
    }, [])

    return (
        <>
            <div className="lottie" style={{
                position: 'relative',
                width: 230,
                height: 150,
                marginBottom: '2rem'
            }} ref={animationContainer} />
        </>
    )
}

export default HelloAnimation