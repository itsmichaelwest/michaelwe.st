---
title: "Your Phone redesign"
description: "A fresh lick of paint and an even fresher set of features."
date: "2018-10-17"
aliases: 
    - /your-phone-redesign/
    - /projects/2018/10/17/your-phone-redesign/
category: "Design Concept"
noMSFT: true
featuredImage: hero.jpg
featuredBlockImage: hero.jpg
featuredImageAlt: "Your Phone app concepts."
---

The **Your Phone** app is launching with the Windows 10 October 2018 update as a new way to connect your Android phone to your PC and access messages and photos. I’ve had a chance to try it out for a while in preview builds, and have come up with a few ideas on how the messages function can be expanded and how calling features can be added to the app. This project focused on these two things.

## Messages

The messaging features of Your Phone are already quite well done today. The next two screens mainly show a slight redesign of the app overall, and the application of Acrylic material to the message list. The conversation view has also been tightened up.

![The messages view of Your Phone. No conversation is selected right now.](/images/your-phone-redesign/YP_Messages.jpg)

![The messages view of Your Phone, now with a selected conversation thread.](/images/your-phone-redesign/YP_Messages_Selected.jpg)

What is new is this popover that now appears when tapping or clicking on a contact’s avatar. This view provides clear information about the person (or persons, in the case of group conversations) you are talking to. It’s also possible to initiate a phone or Skype call directly from here, as well as map an address or start composing an email.

![A popover displays contact info about the person the user is conversing with.](/images/your-phone-redesign/YP_Messages_SelectedInfo.jpg)

## MyPeople

This is a feature that has been requested on the Feedback Hub, so I decided to create a mockup showing how it could be implemented. It appears like most other MyPeople flyouts, and shows the message thread for whatever contact has been pinned.

You can also drag items into a chat thread to send them—in this case, it’s images. Different options may appear depending on what’s being dragged. In the case of images, an option would be shown to quickly upload them to the OneDrive cloud service and then share a link with the recipient—allowing for sharing without losing quality due to MMS restrictions.

![A MyPeople flyout showing an ongoing conversation with a contact. Files are being dragged from File Explorer into the conversation—in this case: images.](/images/your-phone-redesign/YP_Messages_MyPeople.jpg)

## Calls

Logically, one of the next steps for the Your Phone app after photos and messages is the ability to receive and also place phone calls. The next few screens show how this feature could be incorporated.

First you can see how the list of recent calls would look. There are status icons associated with each call, informing the user if a call was outgoing, incoming, or if it wasn’t answered. Wherever possible, there is a button that can be tapped to instantly initiate a new call with that contact.

![Recent calls from the user's Android phone are displayed.](/images/your-phone-redesign/YP_Calls.jpg)

In addition to seeing and making calls to phone contacts, there’s also a Bing-powered search experience that allows a user to type a query—in this case, Martina is looking for lunch in the Bellevue area—and see matching businesses or people. From there, the user can tap an item to view more info or instantly go into a call by using the phone icon.

![The search box allows users to find not only contacts, but also businesses. In this example, we are looking for places to have lunch.](/images/your-phone-redesign/YP_Calls_Search.jpg)

When in progress, calls are displayed in a small CompactOverlay window with buttons to quickly perform common actions such as putting the call on hold (where supported), muting the user’s microphone, or ending the call.

![A CompactOverlay window shows an ongoing call with a contact.](/images/your-phone-redesign/YP_Calls_CompactOverlay.jpg)

Incoming calls are displayed as standard Windows notifications.

## Inking

Pen input is becoming a core part of a lot of Windows experiences. The October 2018 update alone introduces a new screen sketching app and an updated sticky notes experience. I believe inking should also be a part of the Your Phone app.

Here you can see how a user can select a photo (these photos are a collection of images from the connected phone itself, and from the user’s pictures folder on their PC), open it up in a larger previewer, and then use their pen to markup the image before then sending.

![The attach panel showing the most recent photos from the user's phone and PC.](/images/your-phone-redesign/YP_Messages_Attatch.jpg)

Note how there’s the usual set of Windows Ink tools as well as a crop button.

![The attachment markup editor.](/images/your-phone-redesign/YP_Messages_AttatchMarkup.jpg)

Who doesn’t love cute dogs? 😄

![The inked image has now been sent to the recipient. They can use Ink Replay to see exactly how the sender drew on the photo.](/images/your-phone-redesign/YP_Messages_AttatchSent.jpg)

## Final remarks

I haven’t focused on the photos and notifications part of the Your Phone app just yet—I think the photos part doesn’t need much more work and notifications is a topic for another day when I can look into how they could be implemented into the Windows Action Center. That will be the subject of a second design piece sometime in the future.

In the meantime, this concept shows how more functionality could be added to the app while also giving it a fresher look that’s more in line with the Fluent Design System. Let me know what you think!

Thanks for reading! 🙂
