---
author: expobrain
categories: [Guides]
comments: true
date: 2015-09-13 16:43:57
image: {url: /media/2014/01/javascript_code.jpg}
layout: post
slug: create-a-plugin-for-google-protocol-buffer
tags: [json, protocol buffers, python]
title: Create a plugin for Google Protocol Buffer
wordpress_id: 2029
---

Google’s [Protocol Buffer](https://developers.google.com/protocol-buffers) is a library to encode and decode messages in a binary format optimised for compactness and portability between different platforms. At the moment the core library can generate code for C/C++, Java and Python but additional languages can be implemented by writing a plugin for the Protobuf’s compiler.





There is already a [list](https://github.com/google/protobuf/wiki/Third-Party-Add-ons) of plugins to support third party languages however you can write your how plugin to output custom code tailored for your needs. In this post I’m going show an example of a plugin written in Python.



<!-- more -->





## Configuration





Before start writing the plugin we need to install the Protocol Buffer compiler:

{% highlight bash %}
apt-get install protobuf
{% endhighlight %}

to be able to compile ore `.proto` file through our plugin and the Python [Protobuf](https://pypi.python.org/pypi/protobuf) package:



{% highlight bash %}
pip install protobuf
{% endhighlight %}



to implement the plugin.







## Writing the plugin





The interface between the `protoc` compiler is pretty simple: the compiler will pass a `CodeGeneratorRequest` message on the `stdin` and your plugin will output the generated code in a `CodeGeneratorResponse` on the `stdout`.  So the first step is to write the code which reads the request and write an empty response:



{% highlight python %}
#!/usr/bin/env python

import sys

from google.protobuf.compiler import plugin_pb2 as plugin


def generate_code(request, response):
    pass


if __name__ == '__main__':
    # Read request message from stdin
    data = sys.stdin.read()

    # Parse request
    request = plugin.CodeGeneratorRequest()
    request.ParseFromString(data)

    # Create response
    response = plugin.CodeGeneratorResponse()

    # Generate code
    generate_code(request, response)

    # Serialise response message
    output = response.SerializeToString()

    # Write to stdout
    sys.stdout.write(output)
{% endhighlight %}



The `protoc` compiler follows a naming convention for the name of the plugins, as state [protobuf-plugin][here] you can save the code above in a file called `protoc-gen-custom` in your `PATH` or save it with any name you prefer (like `my-plugin.py`) and pass the plugin’s name and path to the `--plugin` command line option.





We are choosing the second option so we’ll save our plugin as `my-plugin.py`, then compiler’s invocation will looks like this (assuming that the `build` directory already exists):



{% highlight bash %}
protoc --plugin=protoc-gen-custom=my-plugin.py --custom_out=./build hello.proto
{% endhighlight %}



The content of `hello.proto` file is simply this:



{% highlight text %}
enum Greeting {
    NONE = 0;
    MR = 1;
    MRS = 2;
    MISS = 3;
}

message Hello {
    required Greeting greeting = 1;
    required string name = 2;
}
{% endhighlight %}



The command above will not generate any output because our plugin does nothing, time now to write some meaningful output.







## Generating code





Lets modify the `generate_code()` function to generate a JSON representation of the `.proto` file but first we need a function to traverse the AST and return all the enumerator, messages and [nested types](https://developers.google.com/protocol-buffers/docs/proto#nested):



{% highlight python %}
def traverse(proto_file):

    def _traverse(package, items):
        for item in items:
            yield item, package

            if isinstance(item, DescriptorProto):
                for enum in item.enum_type:
                    yield enum, package

                for nested in item.nested_type:
                    nested_package = package + item.name

                    for nested_item in _traverse(nested, nested_package):
                        yield nested_item, nested_package

    return itertools.chain(
        _traverse(proto_file.package, proto_file.enum_type),
        _traverse(proto_file.package, proto_file.message_type),
    )
{% endhighlight %}



And now the new `generate_code()`function:



{% highlight python %}
import itertools
import json

from google.protobuf.descriptor_pb2 import DescriptorProto, EnumDescriptorProto


def generate_code(request, response):
    for proto_file in request.proto_file:
        output = []

        # Parse request
        for item, package in traverse(proto_file):
            data = {
                'package': proto_file.package or '&lt;root&gt;',
                'filename': proto_file.name,
                'name': item.name,
            }

            if isinstance(item, DescriptorProto):
                data.update({
                    'type': 'Message',
                    'properties': [{'name': f.name, 'type': int(f.type)}
                                   for f in item.field]
                })

            elif isinstance(item, EnumDescriptorProto):
                data.update({
                    'type': 'Enum',
                    'values': [{'name': v.name, 'value': v.number}
                               for v in item.value]
                })

            output.append(data)

        # Fill response
        f = response.file.add()
        f.name = proto_file.name + '.json'
        f.content = json.dumps(output, indent=2)
{% endhighlight %}



For every `.proto` file in the request we iterate over all the items (enumerators, messages and nested types) and we write some informations in a dictionary. Then we add a new file to the response and we set the filename, in this case equal to the original filename plus the `.json` extension, and the content which is the JSON representation of the dictionary.





If you run again the protobuf compiler it will output a file named `hello.proto.json` in the `build` directory with this content:



{% highlight javascript %}
[
  {
    "type": "Enum",
    "filename": "hello.proto",
    "values": [
      {
        "name": "NONE",
        "value": 0
      },
      {
        "name": "MR",
        "value": 1
      },
      {
        "name": "MRS",
        "value": 2
      },
      {
        "name": "MISS",
        "value": 3
      }
    ],
    "name": "Greeting",
    "package": "&lt;root&gt;"
  },
  {
    "properties": [
      {
        "type": 14,
        "name": "greeting"
      },
      {
        "type": 9,
        "name": "name"
      }
    ],
    "filename": "hello.proto",
    "type": "Message",
    "name": "Hello",
    "package": "&lt;root&gt;"
  }
]
{% endhighlight %}





## Conclusion





In this post we walked through the creation of a Protocol Buffer plugin to compile a `.proto` file into simplified representation in JSON format. The core part is the interface code to read a request from the `stdin`, traverse the AST and write the response on the `stdout`.





However you are not limited in just transforming the input into another format but you can use the request to output any code in any language, you can parse a `.proto` file and output code for a RESTful API in Node.js, converting the message and enum definitions into a XML file or even generate another `.proto` file i. e. without the [deprecated](https://developers.google.com/protocol-buffers/docs/proto#options) fields.



