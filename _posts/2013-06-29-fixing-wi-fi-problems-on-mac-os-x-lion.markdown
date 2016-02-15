---
author: admin
comments: true
date: 2013-06-29 21:10:13+00:00
layout: post
slug: fixing-wi-fi-problems-on-mac-os-x-lion
title: Fixing Wi-Fi problems on Mac OS X Lion
wordpress_id: 1386
categories:
- Guides
- Troubleshooting
tags:
- lion
- mac os x
- wifi
---

Since more than 1 year I had problem Wi-Fi stability problems on my MacBook Pro. Googling around I discovered it was a common problem but I didn't found a clear and final fix for the problem. Last week I found a fix which solved my problem once for all.

<!-- more -->

If truth be told, for that problem a lot of solutions are available but they are in the range of the exotic to absurd:



<blockquote>
If your wifi is dropping thanks to Lion, try this first:
* Reboot your router to connect.
* Immediately open Terminal.
* Copy and paste the following line, exactly as is:

$ ping `route get default | awk '(/gateway/){print $2}'`
 
And then, don't close Terminal... just "Hide" with command-H.
</blockquote>



absolutely a comfortable action to lunch a terminal every time you connect to a Wi-Fi



<blockquote>
Reinstall Mac OS X 
</blockquote>



very common answer by Mac user and power(?) users to any problem on Mac OS X (this remember me the time of Windows 95: reinstall the OS every month to keep it clean LOL)



<blockquote>
Too much wind
</blockquote>



"this laptops works only in sunny and dry days" :-D

When it comes with problems on OS X it's very hard to find someone with expertise, someone which can answer to your questions using a scientific approach than a empiric or random one. In my opinion Window's power users are better in solving problems on the OS, their solutions as more precise and their knowledge of the OS is much deeper than Mac power users.

Anyway, coming back to the Wi-Fi fix it's very simple, make a Time Machine's copy of your system and type this command:


    
    
    $ sudo rm -rf /Library/Preferences/SystemConfiguration
    



and reboot the system. That's it. 

The Wi-Fi of my MacBook Pro is still working flawless since then and after connecting to different wireless networks. 

My 2 cents.
