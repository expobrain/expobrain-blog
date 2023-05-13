---
class: post-template
comments: true
cover: media/os_x_time_machine.png
current: post
date: 2016-12-10
layout: post
navigation: true
slug: fix-corrupted-time-machine-spase-bundles
subclass: post
tags:
- timemachine
- mac-os-x
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

```bash
sudo su -
```

then reset the immutable flags in your sparsebundle, replacing `network_share` with where your
sparsebundle resides and `backup_name` with the name of the spasebundle to fix:

```bash
chflags -R nouchg /Volumes/<network_share>/<backup_name>.sparsebundle
```

Now, this step is the one missing in the most on the solutions I found and only in some posts they
suggest is, in my case this was the key step of the whole recovering process.

Edit the `com.apple.TimeMachine.MachineID.plist` file:

```bash
vim /Volumes/<network_share>/<backup_name>.sparsbundle/com.apple.TimeMachine.MachineID.plist
```

set the value of the key `VerificationState` to `0`:

```xml
<key>VerificationState</key>
<integer>0</integer>
```

and delete the `RecoveryBackupDeclinedDate` key:

```xml
<key>RecoveryBackupDeclinedDate</key>
<date>2012-09-16T01:38:43Z</date>
```

We are at the final stage when we first mount the sparse bundle:

```xml
hdiutil attach -nomount -noverify -noautofsck /Volumes/<network_share>/<backup_name>.sparsebundle
```

then looking at the output search for the `Apple_HFSX` entry:

```xml
/dev/diskx Apple_partition_scheme
/dev/diskXs1 Apple_partition_map
/dev/diskXs2 Apple_HFSX
```

and launch the filesystem recovery tool against `/dev/diskXs2`, note that this step will take hours
to complete so it's better to let it run overnight:

```xml
fsck_hfs -drfy /dev/diskXs2
```

Once the verification is complete and the filesystem is fixed unmount the sparse bundle:

```xml
hdiutil detach /dev/diskXs2
```

At this point the Time Machine backup should be repaired and if you run the backup it will complete
without issues.

I hope this will help and if you have any questions or updates please leave a comment to this post.
