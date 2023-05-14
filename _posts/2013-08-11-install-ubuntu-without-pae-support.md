---
author: admin
categories: [Guides, Troubleshooting]
comments: true
date: 2013-08-11 10:35:43
image: {url: /media/ubuntu_install.png}
layout: post
slug: install-ubuntu-without-pae-support
tags: [32-bit, old hardware, pae, pentium-m, ubuntu]
title: Install Ubuntu without PAE support
wordpress_id: 1560
---

Last night I brought to a new life my old laptop to be used during my commuting time to write posts, to experiments some technologies and last but not least show how old hardware can be recycled and used efficiently.

With my great surprise I discovered most of the 32-bit distro available a this moment (August 2013) are not compatible with my hardware, from another point of view my hardware is a little exotic and GNU/Linux distros had dropped the support to simplify the kernel maintenance.

<!-- more -->



## The PAE problem



My laptop is a 2004 Centrino platform with a 1.4Ghz Pentium-M processor, a pretty fast machine for that time with a lower power consumption but with lack of support of [PAE (Physical Address Extension)](http://en.wikipedia.org/wiki/Physical_Address_Extension). Now add the missing CPU feature with the lack of non-PAE enabled kernels in [almost all](http://en.wikipedia.org/wiki/Physical_Address_Extension#Linux) the current available GNU/Linux distros and you'll start to see the problem.

MY intention was to install the Ubuntu distro and by their documentation the last release with a non-PAE enable kernel is 12.04.2 LTS which doesn't work for me because the kernel loaded during the setup step requires a PAE-enabled CPU :-\. Is still possible to install older version of Ubuntu prior 12.02 but you'll not receive any package updates anymore, in fact for some version of Ubuntu (i.e. 10.10) even the package's repository is completely missing leaving your system with the package versions from the install media.



## Workaround



So we can install any Ubuntu release before 12.04 but we cannot update the packages because the repository is missing EXCEPT for the 11.10: you can install Ubuntu 11.10 and thus upgrade it to 12.04.2 LTS. So here the steps I took:





  1. Install Ubuntu 11.10


  2. Update it with all the available updates by running `apt-get upgrade` until no more updates were pending


  3. Upgrade to 12.04.2 by executing `sudo do-release-upgrade`



The last step leaves you with a Ubuntu 12.04.2 LTS system with a non-PAE kernel. The most recent non-PAE kernel you can install is the 3.2.0-51.

Is it possible now to upgrade to the next release of the Ubuntu distro but before you need to install a [Fake-PAE](https://launchpad.net/~prof7bit/+archive/fake-pae) patch; I didn't try yet because the fear to break my current system's setup and need to start the setup process again (which indeed needs a lot of time).

The last step is the installation og the `b43legacy` package to enable the internal Broadcom wireless adapter and other extra packages including Google Chrome. Suprisingly Chrome is pretty fast despite the old hardware and a little faster than Firfox, I was expecting lower performances remembering the first time I installed Firefox on this machine around 2005 on Windows XP. Event the memory consumption is very compared with the complexity of the application loaded into the memory; a this very moment Ubuntu with Unity 2D, Chrome with a couple of tabs open and a terminal session consume around 400Mb or RAM out of 1Gb and no swap (yes, no swap is used).



## Conclusion



Is always a pleasure to bring old hardware back to life and purpose, I always saey "if is still working why changing it?". Recycling old hardware means also less pollution, no energy spent to try to recycle the recyclable parts from the laptop and burning (or juts dump) the non-recyclable parts. Oh, and you look more hackish ;-).
