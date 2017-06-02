---
author: expbrain
comments: true
date: 2016-12-10
image: {url: /media/os_x_time_machine.png}
layout: post
slug: fix-corrupted-time-machine-spase-bundles
tags: [timemachine, mac-os-x]
title: Fix corrupted Time Machine sparse bundles
---

I know that on the Internet there is an unlimited amout of articles and posts about how to solve
the issue about corrupted Time Machine backups on our NASs. I have tried a lot of them when my
backup has been corrupted but even following religiously their steps I didn't get back a working
backup.

This probably because Mac OS X introduced some changes during every release on how Time Machine
works, making some repair process obsolete or not effective anymore. In this post I'll describe the
steps I took to fix my backup, bare in mind that it worked for me with Mac OS X 10.12.1 Sierra and
I cannot guarantee that it'll work with the previous and future versions of the OS.

<!-- more -->

> Note: Before proceeding further please make a backup of your sparsebundle just in case something
> goes wrong and you can revert back to the original state

First become `root` to speed up the next steps:

{% highlight bash %}
sudo su -
{% endhighlight %}

then reset the immutable flags in your sparsebundle, replacing `network_share` with where your
sparsebundle resides and `backup_name` with the name of the spasebundle to fix:

{% highlight bash %}
chflags -R nouchg /Volumes/<network_share>/<backup_name>.sparsebundle
{% endhighlight %}

Now, this step is the one missing in the most on the solutions I found and only in some posts they
suggest is, in my case this was the key step of the whole recovering process.

Edit the `com.apple.TimeMachine.MachineID.plist` file:

{% highlight bash %}
vim /Volumes/<network_share>/<backup_name>.sparsbundle/com.apple.TimeMachine.MachineID.plist
{% endhighlight %}

set the value of the key `VerificationState` to `0`:

{% highlight xml %}
<key>VerificationState</key>
<integer>0</integer>
{% endhighlight %}

and delete the `RecoveryBackupDeclinedDate` key:

{% highlight xml %}
<key>RecoveryBackupDeclinedDate</key>
<date>2012-09-16T01:38:43Z</date>
{% endhighlight %}

We are at the final stage when we first mount the sparse bundle:

{% highlight xml %}
hdiutil attach -nomount -noverify -noautofsck /Volumes/<network_share>/<backup_name>.sparsebundle
{% endhighlight %}

then looking at the output search for the `Apple_HFSX` entry:

{% highlight xml %}
/dev/diskx Apple_partition_scheme
/dev/diskXs1 Apple_partition_map
/dev/diskXs2 Apple_HFSX
{% endhighlight %}

and launch the filesystem recovery tool against `/dev/diskXs2`, note that this step will take hours
to complete so it's better to let it run overnight:

{% highlight xml %}
fsck_hfs -drfy /dev/diskXs2
{% endhighlight %}

Once the verification is complete and the filesystem is fixed unmount the sparse bundle:

{% highlight xml %}
hdiutil detach /dev/diskXs2
{% endhighlight %}

At this point the Time Machine backup should be repaired and if you run the backup it will complete
without issues.

I hope this will help and if you have any questions or updates please leave a comment to this post.
