---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2011-06-23 23:26:11+00:00
layout: post
navigation: true
slug: experiment-necessitas-qt-apps-on-android
subclass: post
tags:
- android
- c/c++
- mac os x
- necessitas
- qt
title: 'Experiment Necessitas: Qt apps on Android'
wordpress_id: 637
---

Some weeks ago I read about the [Necessitas](http://sourceforge.net/p/necessitas/home/necessitas/) project on the [Qt Labs Blog](http://labs.qt.nokia.com/2011/02/28/necessitas/) which let you able to run Qt application on the Android platform. It was very interesting and now I'm going to try it.

My test environment is my Mac Book Pro with Snow Leopard.

### <!-- more -->

Unfortunately the installation of Necessitas on Mac OS X is done by an online installer so you must be prepared to wait half a hour for the installer to download all the packages it needs. The installation packages can be found in the [Downloads](http://sourceforge.net/projects/necessitas/files/) page.

Now you can start the Necessitas version of Qt Creator inside the `QtCreator/bin` folder and select _Qt Widget Project > Qt Gui Application_ to create a new empty project.

[![]({{ site.url }}/media/necessitas_android_1-150x150.png)]({{ site.url }}/media/necessitas_android_1.png)

Choose name for your project, i.e. Android, and the folder where the project tree will be created. You can set up that folder as your default folder for your future Qt projects if you wish.

[![]({{ site.url }}/media/necessitas_android_2-150x150.png)]({{ site.url }}/media/necessitas_android_2.png)

Now select Android as a build target

[![]({{ site.url }}/media/necessitas_android_3-150x150.png)]({{ site.url }}/media/necessitas_android_3.png)

Next step the creation of the class for the main application and window, the default values are fine for now

[![]({{ site.url }}/media/necessitas_android_4-150x150.png)]({{ site.url }}/media/necessitas_android_4.png)

The last step asks you to select which version control system do you want to use, **None** is a fine for now

[![]({{ site.url }}/media/necessitas_android_5-150x150.png)]({{ site.url }}/media/necessitas_android_5.png)

Now we have our Android test project ready, we must create a new virtual device by entering _Projects_ > _Targets_ > _Run_ > _Manage device configuration_ and press the _Add_ button in the _AVD Manager_ box. State a name for the new emulated device, a target API level and the size in Mib of the SD card.

![]({{ site.url }}/media/necessitas_android_6-150x150.png) [![]({{ site.url }}/media/necessitas_android_7-150x150.png)]({{ site.url }}/media/necessitas_android_7.png)

Close the _Manage device configurations_ window, expand the _Package configuration_ panel an set the _Android target SDK_ to the same one of the newly created device

[![]({{ site.url }}/media/necessitas_android_8-150x150.png)]({{ site.url }}/media/necessitas_android_8.png)

Now expand the _Deploy configurations panel_, check the _Install Ministro system wide qt shared libraries installer_ and select the .apk of Ministro from your hard drive. The .apk can be download from [here](http://sourceforge.net/projects/ministro.necessitas.p/files/).

[![]({{ site.url }}/media/necessitas_android_9-150x150.png)]({{ site.url }}/media/necessitas_android_9.png)

Now you are ready to run your empty project into the emulator. When you run it for the first time you will prompted by Ministro to download the required Qt libraries into the emulator; let Ministro do it for you and

[![]({{ site.url }}/media/necessitas_android_10-150x150.png)]({{ site.url }}/media/necessitas_android_10.png) [![]({{ site.url }}/media/necessitas_android_11-150x150.png)]({{ site.url }}/media/necessitas_android_11.png)

And at the end you will see your empty project in action

[![]({{ site.url }}/media/necessitas_android_12-150x150.png)]({{ site.url }}/media/necessitas_android_12.png)

Well, a white screen is not a big achievement but in this post we are talking about run a Qt application on Android and not about the application itself.

In the next post I'll talk more about run the same application under desktop version of Qt and Android.

Stay tuned !!
