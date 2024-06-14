---
title: "SwiftKey Design System"
description: "I helped lead an effort to clean up and modernize our internal Figma design systems."
aliases:
    - /swiftkey-design-system
category: "Microsoft"
date: "2020-07-31"
featuredBlockImage: hero-block.png
featuredImageAlt: "Various UI components from Microsoft SwiftKey."
hideFromList: false
---

Figma is the design tool of choice for many teams at Microsoft, and this applies to the design team at [Microsoft SwiftKey](https://www.microsoft.com/swiftkey). While we had a robust component library in place -- it was due a refresh after completing a major project that saw us rebuild many of our controls and panels. I worked with another designer on the team to lead an effort to create a new, modern library system that takes advantage of the latest features in Figma and scales well across our entire product.

We use Figma because of it's collaborative nature -- which is crucial for us. While most of the team is in London, we collaborate with partners on all sides of the world and need to be able to share documents quickly and get feedback instantly. This ease of collaboration also makes it easy to share work with partner teams as there is no need to send file revisions, we can simply link them to our living Figma document.

![Keyboard panel buttons from the Android component library.](./buttons.png)

I oversaw updating our Android component library. Many of the components were outdated or did not reflect product truths, especially so for our settings app which had undergone a massive rearchitecture and redesign as part of work for [Surface Duo](/work/surface-duo). I recreated these components from scratch, ensuring they accurately represented our in-market product.

![The library scales to hundreds of components and styles.](./all-components.png)

The new components also take advantage of many new Figma features, such as Auto Layout, that were not available when the team originally switched to this tool. This reduces designer time spent adjusting the position of elements to be "perfect" for mockups, allowing the team to work faster and more efficiently.

I also spent time providing new iconography for SwiftKey, partnering with our internal Design System Studio to craft a custom set of Fluent Icons specifically for the keyboard (see more about these on the [Fluent Icons](/work/fluent-icons/) page). These icons are lighter in weight, and doing this work allowed us to align with Fluent while still being respectful to the existing themes and design of SwiftKey.

![Our design language contains all of the Fluent Icons needed for SwiftKey.](./icons.png)

For flexibility in theming, the keyboard design is built from a set of core "variables". This allows a designer to update the theme of every keyboard component very easily -- changing only a few main components versus having to manually adjust every item. By duplicating the library, it's possible to quickly scaffold a new theme design without having to spend time inside our online theme designer tool.

I organized the components themselves in a logical and neat fashion to make it quick for our designers to get going and make adjustments where needed. Each component has a light and dark style, and it is easy to switch between them using the instance picker. Colors and typography are also arranged and named appropriately.

![Color styles, typography ramp and components are all neatly organized to make it quick and easy for our designers to get going.](./overrides.png)

Download Microsoft SwiftKey for [Android](https://play.google.com/store/apps/details?id=com.touchtype.swiftkey&hl=en_US) or [iOS](https://apps.apple.com/us/app/swiftkey-keyboard/id911813648).
