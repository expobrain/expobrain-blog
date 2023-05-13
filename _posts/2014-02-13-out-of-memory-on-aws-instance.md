---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/aws_cloud.png
current: post
date: 2014-02-13 00:51:29
layout: post
navigation: true
slug: out-of-memory-on-aws-instance
subclass: post
tags:
- amazon web services
- linux
title: Out of Memory on AWS instance
wordpress_id: 1897
---

Do you have a _micro_ instance on Amazon Web Services and you run out of RAM and you don't want to upgrade to a _small_ one? Or do you need just extra RAM to compile Numpy, Scipy and Pandas only once? Here a simple and dirty solution.

AWS instances comes without a swap partition so we will create a new temporary swap file in the root:

    sudo dd if=/dev/zero of=/swapfile bs=1M count=128

This creates a 128Mib file in the root, you can change the value of _count_ to create a bigger or smaller file. Now it's time to format it as a swap area and mount it:

    sudo mkswap /swapfile
    sudo swapon /swapfile

Now that we have an extra 128Mib of memory swap memory we can run our memory hungry process (in my case the compilation of Numpy, Scipy and Pandas) without running out of memory. On finishing you can remove the swap file by just deactivating and deleting it:

    sudo swapoff /swapfile
    sudo rm /swapfile

I suggest to use this method only as a temporary and emergency situation; if you need more quantity of memory n your AWS instance for a long period of time it's better to upgrade the instance to a bigger one than letting the system to swap.
