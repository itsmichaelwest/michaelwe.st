---
title: "Podcasts app concept"
description: "Building a lightweight and modern podcast consumption app."
aliases:
    - /podcasts-app-concept/
    - /projects/2018/06/16/windows-setup-experience/
    - /projects/podcasts-app-concept/
date: "2018-07-20"
category: "Design Concept"
noMSFT: true
featuredImage: hero.jpg
featuredImageAlt: "A Surface Pro shows a podcast app concept, with a pair of Surface Headphones in front of it."
---

This project focused on building a lightweight and modern podcast consumption app. While there are many great third-party podcasting apps on Windows, there’s no solution built into the OS—this app aims to fill that void.

## Listen now

This is the first page the user sees when the app is opened. They’re presented with a collection of some of the podcast episodes they haven’t listened to.

![The Listen now tab, showing unplayed podcast episodes and suggested podcasts.](./PodcastsListenNow.jpg)

Below this are suggested podcasts that the user might enjoy. They can subscribe to the podcast directly from this page, or click on one to view it in more detail.

Connected animations are used in the transition between pages in this app, helping the user remain aware of context and where items will return to when the back button is pressed.

Once on a podcast info page—the user can select an episode to play or get more info by right-clicking. This context menu provides options to not only play the content, but also download it to device for offline listening, getting more details, sharing the episode, or reporting it for inappropriate content.

![A podcast detail page, showing the context menu displayed when an episode is right-clicked.](./PodcastsInfoContextMenu.jpg)

## Search

There is a search box on the right side of the navigation bar, which (rather obviously) searches the catalog of available podcasts. The top three recent searches are shown first (this history can be cleared and/or turned off in the app’s settings), then trending searches are shown—potentially helping users discover new content based around what other people are listening to.

![With the search box selected, you're able to quickly see recent searches and trending searches (things that many people are searching for).](./PodcastsInfoSearch.jpg)

Finally, on certain pages there may be an option to only search in the context of that page. On this podcast info page, toggling that option would mean only that podcast’s episodes would be searched.

## Exploring new podcasts

Under the **Explore** tab, users can discover new podcasts—with both curated selections and suggestions based upon listening history.

![The Explore tab showing a collection of featured podcasts and picks by editors.](./PodcastsExplore.jpg)

Users can also browse by featured podcasts publishers/providers or by category.

## Video

As well as audio podcasts, users can access and play video-based podcasts.

![A video podcast playing, with a darker background than the rest of the app's user interface.](./PodcastsVideo.jpg)

Video podcasts can also be set to display in the corner over the user’s other windows (CompactOverlay mode).

## Multitasking

Above I mentioned how video podcasts can be run in CompactOverlay mode, however they are not the only podcast type to do so. Audio podcasts may also be shrunk down into a persistent floating window, allowing the user to work while still having quick access to playback controls.

![The Your Phone app open while the Podcasts app is displayed in a small compact window over the top-right corner of the desktop.](./PodcastsCompactOverlay.jpg)

For example, here the user is sending a message to a friend using the Your Phone app and the Podcasts app window has shrunk to the top-right corner of the screen. It uses colored Acrylic material, the color being automatically picked by the artwork of the podcast.

## Final remarks

This new Podcasts app gives users a simple way of listening and managing podcasts—both audio and video. Smooth animations and a clean design help keep users engaged. CompactOverlay support makes it easy to multitask while still keeping an eye on what’s playing.

Thanks for reading! If you liked what you saw, sharing would really help me out! 🙂