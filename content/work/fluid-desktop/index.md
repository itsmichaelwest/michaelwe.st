---
title: "Fluid Desktop"
description: "Redefining the Windows desktop experience with a new look, refined apps, and improved Cortana intelligence."
aliases:
    - /projects/2018/03/30/designing-a-new-windows-shell-introducing-fluid-desktop/
    - /fluid-desktop/
date: 2018-03-30
category: "Design Concept"
noMSFT: true
featuredImage: hero.jpg
featuredBlockImage: hero-block.jpg
featuredImageAlt: "Two people sit using Surface Books. One is typing into a chat field, while the other is hovering a pen over the screen."
officialURL: https://uxdesign.cc/designing-a-new-windows-shell-introducing-fluid-desktop-83a01beade91
officialURLText: "Original article on UX Collective"
---

The Windows 10 desktop experience has always been of great interest to me and has been the focus of a lot of my recent design concepts on social media. I’ve received a lot of feedback and have been asked many questions. I want to try and address all that, while also introducing part of a Windows redesign project that I’ve spent the last few weeks working on.

Why redesign the shell anyway? There’s not much wrong with it, right? I agree that it seems a little weird given how there’s much more important parts of Windows that need work on, and it’s not like the shell is fundamentally broken anyway. So we get to the actual design motive:

> “To redesign the shell to be cleaner and more intelligent.”

That’s the goal. To get rid of the current clutter and replace it a more minimal yet more powerful experience. I call it **Fluid Desktop** and I want to share the journey it took to get here.

## Taskbar

Some of you might remember when I wrote about [reworking the Windows system tray](https://medium.com/@itsmichaelwest/reworking-the-windows-system-tray-9577b646731e) over a year ago. Inspired and excited by what possibilities there were in this area, I continued to refine the design further to create a flyout I eventually named _Quick Actions_, and even apply the same overall look and feel to Action Center as well.

This led to a new system tray design. Gone was the overflow of icons and applets that have cluttered up the taskbar since 1995 — and in its place: a clean tray with only the essential information presented.

Afterwards I started thinking about how the taskbar itself could be simplified. I couldn’t remove any more icons, the system tray rework had already removed everything possible. So I thought about the actual taskbar — could its shape, size, even material be changed? What if it wasn’t constantly attached to the edge of the screen, and instead floated (something inspired by some versions of Chrome OS).

Here’s the first iteration of that new taskbar:

![A key component of Fluid Desktop — the floating Taskbar](./floating-taskbar-crop.jpg)

Things felt more open now the taskbar was split in two. The people button was also detached from the rest of the system tray, as it’s not really directly related to that component.

Initial feedback centered around one thing — the Start button.

Currently on Windows, the Start button sits in the corner of the screen, so you just have to move your cursor into any of the four corners of your display to quickly get to the Start menu. People were concerned that moving the Start button away from the edge of the screen would prevent this behavior from working.

The answer is simply to make the target area for Start extend into the corner, allowing users to continue to use muscle memory to access this feature.

Other feedback focused on tablet mode usage. I thought about this one for a while. Today, the taskbar remains visible on Windows when you enter tablet mode — but I always preferred the Windows 8 way of having apps run full-screen in this mode and now that the taskbar “floats”, the idea of it drifting off the edge of the screen and only appearing when the user swipes from the edge makes more sense.

## Sets

Microsoft [announced](https://www.youtube.com/watch?v=3lEjuU-XFHg) a new feature dubbed _Sets_ in November 2017, and I’ve been interested in how this would work with things like the taskbar and Task View. I’ve not yet finalized a design on how a set of apps will look in Task View, but I did design a rather minor change to how they’re displayed on the taskbar.

Instead of these apps scattered across the taskbar, why not group them together and include a small visual cue that the apps are part of a Set?

![Previews of different sets tabs on the taskbar.](./taskbar-sets-popover.jpg)

Also, having tabs on top of every app is somewhat unconventional — especially for utility apps like Calculator. With that in mind, adding a new tab button alongside the existing window caption controls doesn't seem like a bad idea.

## Start Menu

This isn’t something that has to actually be thought about. You could just bolt on the existing Windows start menu to the new taskbar and leave it at that—but it doesn’t exactly look all that great. Something didn't feel right.

![An early Start menu idea for Fluid Desktop.](./shell-start.jpg)

There’s still work to be done in terms of element sizing, but this updated Start menu design fits in better with the overall modern look and an integrated search box at the top replaces the need to have a search bar confusingly placed at the bottom.

## Intelligence

You might have realized that Cortana seems to be missing. Her button was replaced by a search icon (that launches a search UI much like the one [discovered in Redstone 4 builds](https://www.windowscentral.com/microsoft-working-new-search-ui-windows-10) last year). The Spring Creators Update already moves a lot of Cortana’s “cards” and other proactive info to Action Center, where it gets delivered when a user needs it.

But what if you could go to Action Center and see suggestions of things you might want to act upon, and talk to Cortana in a more chat-like fashion (like you can with Google Assistant)?

Here’s what that idea could look like:

![Intelligent Action Center in Fluid Desktop.](./shell-actioncenter.jpg)

As always, notifications are displayed first, followed by suggestions of things you might want to act upon. They could be calendar events (like shown here), local news, weather alerts, reminders, and even activities based on your nearby devices or location.

![Talking to Cortana directly in Action Center on Fluid Desktop.](./shell-actioncenter-chat.jpg)

At the bottom of Action Center is the text box that we’re familiar with from the taskbar and you can still talk to Cortana by tapping the microphone icon. The queries you type are shown as "messages" to Cortana, with her replies being inline — allowing for a greater level of context since you can scroll back up and see your previous replies in that conversation. The conversation idea also helps bring a bit more consistency between Cortana in Windows and Cortana in Skype (where it acts as a bot in your chats).

_Note: This content was originally published on UX Collective in March 2018. It was shortened and rewritten in July 2020, alongside some render updates._