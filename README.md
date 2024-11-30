# family-hub
Simple kiosk for displaying a family dashboard based on Notion.


## What
The goal of this project is inspired by Hearth Display. It aims to be a lightweight family hub that could be run in a browser.

## Why
My family could definitely benefit from a family calendar. The commercial product has a decent upfront cost and more often requires subscriptions. We used Notion for task management already so we just need another surface for our Notion tasks.

## How
### Recommendation for Setup
* Get an (unused) tablet and a stand. 
  * Or you could get one of those Lenovo [Thinksmart for teams](https://computers.woot.com/offers/lenovo-thinksmart-video-conference-equipment-2) for less than $20, and install customized android on it.
* Install family-hub (this repo) on a server either locally or in a cloud VM.
* Install a browser that supports kiosk mode (e.g. [Fully Kiosk Browser & Lockdown](https://play.google.com/store/apps/details?id=de.ozerov.fully&hl=en_US) for Android)
* Load the nextjs in the browser (`http://${ip}:3721`)