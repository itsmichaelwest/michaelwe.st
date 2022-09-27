---
title: 'Cortana OS'
description: 'A hypothetical take on Windows 10 designed around proactivity and assistance.'
aliases: 
    - /blog/2019/01/27/design-decisions-in-cortana-os/
category: 'Concept Sprint'
date: "2019-01-27"
featuredImage: hero.jpg
featuredBlockImage: hero-block.jpg
featuredImageAlt: "A tablet displays a screenshot of the Cortana OS Start menu."
featuredImageTwitter: 'hero.jpg'
noMSFT: true
hideFromList: false
---

This weekend, I posted some initial mockups for a project called "Cortana OS" to Twitter. Character limits make it hard for me to convey everything I want to, so I wanted to write this short post explaining some of the design decisions that went in to this.

## Branding

_Cortana OS_

It sounds strange and perhaps should only be considered a working title (I've been suggested plenty of different names), but let me explain why it **isn't** called _Windows_.

This product, while following a similar design language and interaction model as Windows, isn't Windows. It's something completely new, free from legacy components. Windows RT and the later Windows 10 S have both suffered because they were branded as _Windows_. Users entered the product with an expectation that because it carried the windows name, it could do run all their legacy apps and features.

Calling this product something entirely new helps break away from that expectation.

## Visual aesthetic

![The Mail and Store apps in Cortana OS shows how rounded corners are used throughout the design, complimenting the radiused corners of the display.](/images/cortana-os/rounded.jpg)

Cortana OS devices come with screens of all shapes and sizes — they may be square or they may be rounded, like in the examples shown. To compliment these various screen shapes, the system adapts the corner radius of interface elements. On a square screen elements have subtle rounded off edges, while on rounded screens the elements have more pronounced radius.

This is part of creating a more friendly aesthetic. Cortana is a bubbly and fun personality, and thus this Cortana OS product should align to that.

## Gestural interface

![The keyboard is powered by the same SwiftKey intelligence as on Windows 10 and includes gestural typing. Other gestures are used to access system surfaces.](/images/cortana-os/kbandstart.jpg)

To create a simpler experience, there is no taskbar of any kind in Cortana OS. This presents a question — how do you navigate between their apps and other system surfaces?

The answer is: _Gestures._

Similar to the gestural system on products like iPhone X, a swipe from the bottom of the screen will display the Start overlay and this works no matter where you are in the product.

A swipe from the top edge of the screen will present a multitasking view similar to that on Windows 10. You arrange apps in split-screen setups by dragging them to the left or right of the screen.

A swipe from the right will present the familiar Action Center, already found on Windows 10.

## Other loose ends

![Microsoft Edge on Cortana OS has the same rich features as it does on the desktop — including picture-in-picture and assistance.](/images/cortana-os/other.jpg)

_"What about the desktop?"_

Cortana OS does not have a desktop mode as this would contradict the simplistic nature of the product. Apps can run in a split-screen arrangement, but there is no freeform windowing by design.

_"Where are the Live Tiles?"_

As [reported by Windows Central](https://www.windowscentral.com/are-windows-10s-live-tiles-dead) last week, it's looking like Microsoft's upcoming "Windows Lite" doesn't include Live Tiles. I can understand why, users can be confused when their app icons seemingly keep changing. Because of the news that Lite may ditch tiles in favor of static icons, I've done the same.

_Note: This content was rewritten in July 2020, alongside the addition of updated renders._