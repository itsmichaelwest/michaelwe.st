---
title: "Windows OOBE redesign"
description: "Giving the Out-Of-Box Experience a fresh look that's more in line with the Fluent Design System."
aliases:
    - /oobe/
    - /projects/windows-oobe-redesign/
    - /projects/2018/06/16/windows-setup-experience/
date: "2018-06-16"
hideFromList: true
category: "Design Concept"
noMSFT: true
featuredImage: hero.jpg
featuredBlockImage: hero.jpg
featuredImageAlt: "Two laptops display concepts of a setup experience." 
---

This project focused on making the Windows Out Of Box Experience (OOBE) simpler and look more in line with the Fluent Design System that’s been making its way into Windows over the last year.

## Startup and welcome
When the user switches on their PC for the first time, they are presented with a welcome screen that displays a variety of common languages on the left. Each language is displayed in its localized name—as you can see, Germany is written as _Deutschland_.

![](./welcome.jpg)

On the right of the screen is a large image of the device being set up. The screen content of the device is dynamic and changes according to which part of OOBE the user is in. This image should be provided by the device manufacturer, and isn’t displayed on custom PCs or virtual machines. The _Welcome to your_ text is also set by the manufacturer—because it’s a Surface Pro in this case, that’s what is said.

With this design, the reliance on Cortana for the setup experience has been removed in favor of either pressing a particular keyboard key or waiting a few seconds for Cortana to start speaking—something a lot of users have been asking for. The text in the lower-left corner of the first page illustrates this.

![](./keyboard.jpg)

The user’s keyboard layout is chosen next, with the most relevant layout displayed at the top of the list already selected.

## Network setup

Next the user can connect to a network. This is obviously recommended, since doing so allows Windows to download updates and sign the user into their Microsoft Account. The connection can be done over Wi-Fi, Ethernet, or cellular (in the case of devices with a SIM card already inserted).

![](./wifi.jpg)

## End User Licencing Agreement

This one is pretty self-explanatory. You have to accept to use Windows. I’ve included a screenshot of this just so you can see how it fits in with the rest of the setup experience.

![](./eula.jpg)

## Signing in

Now the user should sign into their Microsoft Account. Notice how the image shown on the device screen to the right changes to an appropriately themed image. This is a common pattern across the entire experience. There is explanatory text below the email address box, telling them what benefits signing in with a Microsoft Account gives them.

![](./sign-in-1.jpg)

It’s possible to use a local account by simply clicking the ‘Offline account’ button in the bottom-left corner.

After clicking the ‘Next’ button, the user must enter their password or confirm the sign-in using an authenticator device. Again, notice how the screen image changed to display the user’s profile picture.

![](./sign-in-2.jpg)

After the user is signed into Microsoft, and if they are using a supported device, the Windows Hello setup page will appear. A new component in this experience is the video player, which can be used to provide additional info about certain features or give tutorials on how to do things. In this case, a video telling the user about Windows Hello is displayed.

![](./sign-in-hello.jpg)

## Restoring the device

Signing into a Microsoft Account will allow the user to restore the new device from a OneDrive backup created on any of their other devices. A list of available backups is shown, and the user can select which one they wish to restore from. Doing this will skip the next few pages, landing the user on the desktop, since the various privacy and personalization settings are brought over from the backup.

![](./restore.jpg)

While the user may choose to set up the device without restoring content, app data and settings will still sync from OneDrive.

## Setting up OneDrive

After the user has chosen if they wish to restore the device or not, they will then get the option to set up saving all their files to the cloud using OneDrive. There are three different options presented:

![](./onedrive.jpg)

The first option is the equivalent to enabling all three of the folder protection options in Windows 10 today, redirecting the Documents, Pictures, and Desktop folder to the cloud. The second choice will set up OneDrive and store the user’s system and app settings, but without enabling folder redirection. The third will set up OneDrive, but not store settings or files automatically.

## Cortana and privacy settings

These next couple of pages are very similar to how they are now on Windows, just styled differently. The first page asks if the user wishes to enable the Cortana digital assistant. The same information that is displayed now is shown and there are two clearly labelled buttons at the bottom for enabling or disabling Cortana.

![](./cortana.jpg)

Next are the general privacy settings for Windows. This page was revamped last year to provide more control to users, with a collection of toggle switches. These switches are preserved in this new design, but now have iconography to make them stand out more.

![](./privacy.jpg)

## Linking phone and PC

Now the user gets the chance to link together their phone and PC. This is done through the Microsoft Launcher on Android, or the Edge app on iOS. Connecting the user’s devices together allows them to take advantage of a whole bunch of great features—like Continue on PC, a feature that allows the user to send any supported activity to their PC.

![](./continue-on-pc.jpg)

This screen is shown after the various privacy options, as the choices made there may affect if they can use the connected devices experiences.

## Personalizing Windows

This is a page that was partially present in the Windows 8.x setup experience (accent color selection was one of the first things a user did when setting up Windows), but was then removed with Windows 10. With the new OOBE design, this page returns, but also now with an option to choose the app mode the user wants—light or dark. A user can skip this page, accepting the defaults, or make adjustments and save them.

![](./theme.jpg)

If the user makes a change, it’s reflected in real-time on the page. For example, in the screenshot below, the user has changed their Windows theme to dark and the accent color to red.

![](./theme-changed.jpg)

If the user has previously synced theme settings on OneDrive, these will be the “defaults” applied on this page.

## Completing setup

The last page a user sees before they hit the desktop is this one. Before the user can start using Windows, their account needs to be provisioned—setting up all their apps and settings. In previous iterations of the OOBE, this was done behind a slideshow of shades of blue with basic text on it.

This new design allows a user to watch some videos showing them what’s new in the particular feature update to Windows 10 they’re using before taking them to the desktop.

![](./finished.jpg)

A small informational notice towards the bottom of the screen tells the user they will be automatically taken to the desktop once this portion of setup is complete, meaning they do not have to watch all the videos to get into Windows. If the user is watching a video and setup is done, they will be taken to the desktop _after_ the video finishes playing.