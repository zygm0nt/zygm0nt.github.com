---
layout: post
title: "Should you switch to Mac?"
date: 2016-07-07 23:22
comments: true
categories: 
    - hacking
    - mac os x
---

![enter image description here](https://farm9.staticflickr.com/8064/8229071681_02ffdb91dc_z_d.jpg)*by Flick user [raneko](https://www.flickr.com/photos/raneko/8229071681/in/photolist-dxb9je-sEQEP-5gDCSr-PE6FE-7Pa2t3-5yhFqq-MsHbZ-tEVFv-kBEvsd-5uPrGV-a5wisf-Ea1We-5tX2pp-22ybhw-ivTix6-5yk9cA-kBCugR-gcSkD-8cdXjv-asK9Y-7ZM66R-8N4eSG-4mchWA-4pjwaT-Gy8BR-7HPwfe-dxb9hv-4rXMuz-h6gJgm-9jULZ6-5SPsfu-kBECo7-6UUwCT-5whRwW-4rujwZ-8Kye5Q-9hN1d6-5utN7V-k9drqQ-4QPsUy-8VEazh-8UB7Ms-8VEaEq-neQih-8EHChx-ecth3o-8yrLUn-o7oNS-kBCXKM-6UYBrs)*

Who would have thought? Me switching to Mac? But it actually happened. I've been a long time Linux user, so why actually do the switch now? Or ever? Have a look at my thoughts and insights of novice Mac user.

<!--more-->

## In the beginning

My humble beginnings were with RedHat 6.0 on a AMD Duron 600Mhz PC machine. With a dialup connection. And setting that thing to connect into Poland's national provider TPSA was rather painful. After some time using Linux, going from RedHat to Slackware I've decided things weren't tough enough and switched to BSDs. That was really fun! I've used Free and Open flavors for a few years which very really great. Than switched back to Linux. I've used those \*nix systems for all-things-computer. At home and at work. 

## The switch

And than came the new job and I had to choose: regular Dell or Macbook? Blue pill or red pill? I chose the later. 

The switch wasn't that painful, but mainly thanks to superb hardware Apple offers. Having to get used to a completely new OS was quite another story. It's not that I was shocked by it. As a long time Linux user all the concepts are known to me. It's the other way around - there are a lot of things missing that I learned to require from my tool of work. 

What I really appreciate is the known userland tools - it's BSD at the heart of it. Well, of course the kernel is some whacky Mach microkernel, but as for the userland I'm happy :) You can read more about the kernel and system's design history on wikipedia ([Os X](https://en.wikipedia.org/wiki/OS_X), [Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) [XNU](https://en.wikipedia.org/wiki/XNU))

One of the biggest disappointments was the filesystem and the way it's presented to users. Mac OS X comes with HFS+ ([link](https://en.wikipedia.org/wiki/HFS_Plus)) filesystem which is case insensitive!!! To me this seems like an abomination. Plus there are multiple shortcuts taken by Apple engineers, like its endiannes: primarily Macs used PowerPC chips which are BigEndian by desing, but after switching to Intel processors everything is LittleEndian now. AFAIK HFS+ has to still switch bytes when reading metadata.

Really neat thing I've found out recently is that under the hood OS X uses PF (OpenBSD's packet filter) as a firewalling solution. 
I don't know which version is in the current release and how does it compare against the original implementation, but since PF has such a nice syntax and performance it's great to have it on board. There are numerous blog posts about setting a decent firewall on OS X with PF so go have a look. Also you can play with PF by means of a set of apps called [Murus](http://www.murusfirewall.com/).

## Useful tools

* [Brew](http://brew.sh/) - basic application provider, offers all the things I've become used to when on Linux,
* [Amethyst](https://github.com/ianyh/Amethyst) - allows window tiling with keyboard shortcuts and has focus-follows-mouse :D I love this feature, although with all the windows popping all over the place I must admit it sometimes gets messy.
* [MenuMeters](https://www.ragingmenace.com/software/menumeters/) - have a bunch of those geeky meters all over the place (no longer usable with El Capitan)
* Alfred - seems like a nice app, Spotlight on steroids. It's free and you can download it via [ITunes](https://itunes.apple.com/au/app/alfred/id405843582?mt=12)
* Flashlight - add more providers to Spotlight - unfortunately with recent introduction of rootless mac partition it's no longer possible to use this tool

## Hacking Spotlight

Spotlight is just that neat little thing out there that seems like indexing all the things and runs installed programs. But it can also serve as a calculator and ...

You can also read the contents of its cache file.

Up until version 10.10.4 of OS X it was possible to have additions to spotlight, but now this behaviour is blocked by the system. 
http://mac-how-to.wonderhowto.com/how-to/customize-spotlight-search-mac-os-x-yosemite-0160786/

## Script setup

Setup your mac with this shell script - but be very careful and read through this file first! https://gist.github.com/brandonb927/3195465

![One sneaky image](https://farm6.staticflickr.com/5168/5263917715_6c8217fcfe_z_d.jpg)*by Flickr user [blakespot](https://www.flickr.com/photos/blakespot/5263917715/in/photolist-929XkZ-fJwTR-8Me2LN-8qSP9F-6UD2Ce-fM51y-ARaAo-BJXFt-iE8ep-4rXScB-bX3z7w-6npV8P-5Eamox-33QA9W-5EXuR9-mQDnb-6UqpxG-6UqF7m-69b4jp-oytZCJ-4rXGFP-6xweAZ-ACukt-aZfi5-6QouE3-5CAQgW-8MeHqC-5QBeu1-L4qEw-4s35hq-4w9tXh-67Ymah-4s33cu-jjDFo-6J3zqD-8N4tSh-kbFD4-sESfP-66GAT5-9FUKfq-d3BrPG-4rXPZt-8N1aLa-6UCTvi-kBCzsH-2SXDWe-5CGTEq-5zogZ2-5JAGsk-kkAgZK)*

## Neat things
And it is quite positive, that Mac OS X developers care about small, but extremely important things - like building OpenSSH with LibreSSL support! 

## DTrace
Recently I've experienced a huge slowdown on my Mac. The It support's solution was to reinstall the OS. I refused, this seemed like a barbaric method and also I just wanted to use this opportunity to delve deeper into internals of this OS.

I've started with analysing system behaviour with [DTrace](https://en.wikipedia.org/wiki/DTrace) - probing interface originating from Solaris

Useful introductory links are here:

- http://dtrace.org/blogs/brendan/2011/10/10/top-10-dtrace-scripts-for-mac-os-x/
- http://dtrace.org/blogs/brendan/2012/11/14/dtracing-in-anger/

## Conclusion
All in all the switch was relatively painless, and with tools and tricks described here I feel very comfortable using this system. 
