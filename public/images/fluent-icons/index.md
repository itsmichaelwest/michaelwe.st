---
title: "Fluent Icons"
description: "A brand new monoline icon system for Microsoft."
aliases:
    - /fluent-icons
category: "Microsoft"
date: "2020-07-31"
featuredImage: hero.png
featuredImageAlt: "A view of a collection of common Fluent Icons."
featuredBlockImage: hero-block.png
officialURL: https://github.com/microsoft/fluentui-system-icons
officialURLText: "View icon repository"
hideFromList: false
---

The Fluent UI Icons are a set of monoline icons from Microsoft, designed originally for mobile apps but with the web and desktop in mind. These icons are based on metaphors established by the older "MDL2" set originally conceived and widely used by the Windows team. They compliment the new [Fluent Design System](https://www.microsoft.com/design/fluent/) and the additional full-color app icon work undertaken by Office, Windows, and countless other teams across Microsoft.

I was part of a team spanning designers from across the company that laid the groundwork for this icon system. We were able to quickly scale the system from a handful of icons to thousands over a few months. Using an agile approach we were able to release new icons every week, prioritizing icons for teams that needed them immediately.

While being based on the same or similar metaphors to make the transition easier, Fluent Icons have a slightly different visual style. The icons also have rounded corners and end-caps. They span all platforms, creating harmony and uniformity across apps and services.

![Examples of Fluent Icons in Yammer on iOS and Outlook on Android, showing how they can scale across platforms.](./examples.png)

While the project originally started with designing Fluent Icons for mobile use, they have also started appearing in Microsoft's desktop apps -- notably first in Microsoft Edge. A new size, 20px, was specifically selected for use in desktop settings as with padding it allows the Fluent Icons to replace existing 16px MDL2 assets.

![Fluent Icons in the Microsoft Edge web browser.](./edge.png)

To allow flexibility, the icons are available in multiple styles and sizes. The size ramp goes from 16 to 48 units, with each size being hand-drawn to ensure pixel perfection. Outline and filled states are used for indicating selection, or when a filled icon will be more visible than one that is outlined.

![The size ramp and outline vs. filled states.](./ramp.png)

There is also a comprehensive modifier system that can be used to easily add common states to an icon -- for example, a plus icon can be affixed to any corner to create an "Add" state. These modifiers are consistent so users can reliably know where to see the state or additional action an icon represents.

![A small subset of the available modifiers.](./modifiers.png)

There is a great article on Microsoft Design's Medium site where Fluent Icon leads answer a few questions from the community. I recommend checking it out: [Developing an Open Source Icon System at Microsoft](https://medium.com/microsoft-design/developing-an-open-source-icon-system-at-microsoft-b1796315df9f). The icon system is now [open-source](https://github.com/microsoft/fluentui-system-icons) and available for anyone to use in their apps and websites.
