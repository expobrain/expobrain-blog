---
author: expobrain
categories: [Various things]
comments: true
date: 2014-09-26
image: {url: /media/2014/01/javascript_code.jpg}
layout: post
slug: hide-javascript-code-into-images
tags: [go, hacking, html5, javascript]
title: Hide JavaScript code into images
wordpress_id: 1896
---

In this post I'm going to explain how it's possible to hide JavaScript code into a PNG image and executing it into the browser without leaving any trace in the HTML document. This kind of hiding technique can be used to load JavaScript code into the browser bypassing the common scanning for malicious files because usually the content of an image is considered to be pixel's information and not executable code.

<!-- more -->

**TL;RL**



## The idea



The basic idea is to write the content of a text file, JavaScript code, as RGB triplets in a PNG image. The image is then loaded in a HTML document, the RGB triplets decrypted and the code executed in the browser.

The encoding step generates a square PNG image containing the length of the payload and the payload itself interleaved by the alpha channel (which is not used for storage); the decoding step extracts the payload into the browser's memory and execute the payload without altering the DOM.

For learning purposes the encoder is written in [Go](http://golang.org/) where the decoder is pure JavaScript without involving ay external library to keep the code as smallest as possible.

All the source code is available on [GitHub](https://github.com/expobrain/javascript-js2png).



## From code to PNG



Let's start with the encoder in `src/net.expobrain/js2png/js2png.go`. First we need a buffer to store the bitmap in RGBA format:



{% highlight go %}
var buffer = new(bytes.Buffer)
{% endhighlight %}




Now we need to write the size of the payload:




{% highlight go %}
var payload_sz = len(src)

buffer.WriteByte(0)
buffer.WriteByte(uint8(payload_sz >> 56 & 0xff))
buffer.WriteByte(uint8(payload_sz >> 48 & 0xff))
buffer.WriteByte(255)
buffer.WriteByte(uint8(payload_sz >> 40 & 0xff))
buffer.WriteByte(uint8(payload_sz >> 32 & 0xff))
buffer.WriteByte(uint8(payload_sz >> 24 & 0xff))
buffer.WriteByte(255)
buffer.WriteByte(uint8(payload_sz >> 16 & 0xff))
buffer.WriteByte(uint8(payload_sz >> 8 & 0xff))
buffer.WriteByte(uint8(payload_sz & 0xff))
buffer.WriteByte(255)
{% endhighlight %}




The payload's size is stored as a little-endian 64-bit unsigned integer right-aligned on 9 bytes and interleaved with a `255` byte which represent the alpha channel.

The right alignment is just for convenience and easy debugging so the first 3 pixels contains the length of the content and the content itself will start from the R channel of the 4th pixel.

The alpha channel is set to `255` so on saving the bitmap the values of the RGB channels will be same even after been multiplied by the alpha channel. For instance, with an alpha channel set to `0` the resulting RGB value will be `0x000000`, with and alpha channel of `128` all the RGB values will halved, and so on.

Time to write the payload into the buffer, still interleaved by a `255` every 3 bytes:




{% highlight go %}
var data_sz = int(math.Ceil(float64(payload_sz) / 3))

for i := 0; i < data_sz; i++ {
    p := i * 3

    _, err := buffer.Write(src[p:p + 3])
    if err!= nil { panic(err) }

    buffer.WriteByte(255)
}
{% endhighlight %}




Now that we have the buffer complete with size and payload we can copy it into a square bitmap:




{% highlight go %}
// Create bitmap to fit the payload
var bitmap_sz = int(buffer.Len() / 4)
w := int(math.Ceil(math.Sqrt(float64(bitmap_sz))))
h := int(math.Ceil(float64(bitmap_sz) / float64(w)))

rect := image.Rect(0, 0, w, h)
img := image.NewNRGBA(rect)
img.Pix = make([]uint8, w * h * 4)

// Copy payload into bitmap
copy(img.Pix, buffer.Bytes())
{% endhighlight %}




The extra unused space in the final bitmap is padded with zeros. In theory the final image can have any shape you want, I just found a square image more attractive for my likes.

Last step is writing the PNG to disk:



{% highlight go %}
dst, err := os.Create(dst_filename)
if err != nil { panic(err) }
defer dst.Close()

png.Encode(dst, img)
{% endhighlight %}




That's all for the encoder.



## From PNG to code



The JavaScript loader in `html/js/loader.js` is triggered on the `load` event of the `payload` element aka our PNG image:




{% highlight javascript %}
var img = document.getElementById("payload");

img.addEventListener("load", function () {
    ...loader...
}
{% endhighlight %}




We cannot read pixel data straight from the image so we render the image on a HTML5 `canvas` element:




{% highlight javascript %}
var context, canvas;

canvas = document.createElement("canvas");
canvas.width = img.width;
canvas.height = img.height;

context = canvas.getContext("2d");
context.drawImage(img, 0, 0);
{% endhighlight %}




Reading back the size of the payload:




{% highlight javascript %}
// Read image's data
var data;

data = context.getImageData(0, 0, img.width, img.height).data;

// Read size of the payload
var size = 0;

size += data[1] << 56;
size += data[2] << 48;
size += data[4] << 40;
size += data[5] << 32;
size += data[6] << 24;
size += data[8] << 16;
size += data[9] << 8;
size += data[10];
{% endhighlight %}




and the payload itself:




{% highlight javascript %}
// Read payload into string
var payload = '';

for (var i = 12; i < data.length; i++) {
    if ((i + 1) % 4) {
        var char = data[i];

        if (char >= 32) {  // Strip any non-ASCII to keep eval() happy
            payload += String.fromCharCode(char);
        }
    }
}
{% endhighlight %}




Now that we have the original code stored into the `payload` variable we can execute it by a simple:




{% highlight javascript %}
eval(payload);
{% endhighlight %}




By using `eval()` we can execute the code without leaving any trace into the DOM.



## Conclusion



This is just a proof of concept. The code being injected into the image and the loader are just plain JavaScript files, no minification nor obfuscation is applied to reduce the size of the payload and hide the real scope of the code. Also JavaScript code is needed to extract the payload from the image.

However even this technique is simple detecting hidden code in a image is hard; the only possible weak point is the loader which is the only clue of the existence of a hidden payload.

