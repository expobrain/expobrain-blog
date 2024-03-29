---
categories:
  - Main
class: post-template
comments: true
current: post
date: 2012-02-12 20:42:24+00:00
layout: post
navigation: true
slug: best-compressible-serialisation-format
subclass: post
tags:
  - json
  - pickle
  - protocol buffers
  - python
  - xml
title: Best compressible serialisation format
wordpress_id: 763
---

For my next project I need to serialise a list of classes using the technology which fits those requirements:

- ninimum code to serialise/unserialise

- minmum file size when compressed

As you can see the speed for read/write the serialised data is not a requirement but the size of the compressed file is the most important prerequisite.

<!-- more -->

The data set used in my test is the Directory of UK Archives available at the [UK National Archives Lab](http://labs.nationalarchives.gov.uk/wordpress/index.php/2011/07/datasets/) blog which represent more or less the worst case scenario (a lot of string fields of variable length and an integer and enumerator fields) and enough records to expose the differences in file sizes between every serialisation format.

## Prologue

The candidates as serialisation's backend are 4 and they are well known (maybe except for Google's Protocol Buffers):

- Python's Pickle module: already distributed with the Python interpreter, cross platform and with a very easy API

- JSON: originally from the JavaScript world but has an implementation in Python

- XML: no need to introduce it, it's possible to write XML files easily with Python's lxm2 package

- Google Protocol Buffers: a new entry, born inside Google and became public as a 20% project

A common module contains the code to read the data into a dictionary and write the bytearray the disk:

```python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals, print_function, division
import csv
import bz2
import gzip

DATA_FILENAME = "data.csv"
TYPES = {
    'University': 0,
    'Business': 1,
    'Local': 2,
    'National': 3,
    'Special': 4
}

def get_data():
    reader = csv.DictReader(file(DATA_FILENAME, "r"), delimiter=b",")
    data = []

    for row in reader:
        row["RepositoryID"] = int(row["RepositoryID"])
        row["Type"] = TYPES[row["Type"]]

        data.append(row)

    return data

def write_stream(stream, filename):
    with file(filename, "wb") as f:
        f.write(stream)

    with gzip.GzipFile(filename + ".gzip", "wb") as f:
        f.write(bytes(stream))

    with bz2.BZ2File(filename + ".bz2", "wb") as f:
            f.write(stream)
```

The function `get_data()` reads the CSV file into a dictionary converting the _RepositoryID_ field into an integer and the _Type_ filed into an enumerator.

The function `write_stream()` accepts the data stream generated by the serialisation's format and write it into files with different level of compression: no compression, standard gzip compression, maximum compression with bzip2.

## Python's pickle

Python's [pickle](http://docs.python.org/library/pickle.html) is a package available in the standard installation of the Python interpreter. Is the first way of object serialisation which came up in my mind.

```python
import pickle

write_stream(pickle.dumps(get_data()), "to_pickle.dat")
```

The code is very easy: get the data dictionary and dump it into a bytearray. The uncompressed size of the stream is almost the double of the original data (900k vs 500k) but even compressing with gzip the file's size shrink near to half the original CSV file size.

## JSON

JSON is a format used in JavaScript and it's becoming popular because it's more huma readable than XML, less verbose and it has come exotic features (like creation of class instances from JSON data by eval()).

```python
import json

write_stream(json.dumps(get_data()), "to_json.js")
```

As with Python's Pickle the code is very compact, although the uncompressed JSON stream is bigger as the Pickle's one but the compressed one is around one third.

## XML

There's no need to introduce XML to you :-)

```python
from lxml import etree

def get_xml(data):
    root = etree.Element("data")

    for row in data:
        item = etree.Element("item")

        for k, v in row.iteritems():
            field = etree.Element(k)

            field.text = "{}".format(v)

            item.append(field)

        root.append(item)

    return etree.tostring(root)

write_stream(get_xml(get_data()), "to_xml.xml")
```

The code is not so clean like with Pickle and JSON, we need to iterate the dictionary to create nodes for every item and leaves for every item's field. This increase the code you need to write to serialise/deserialise your data. Looking at the file sizes the uncompressed one is three times bigger than the original (obviously because the verbosity of the XML format) but the compressed one are just a few kilobytes smaller than the JSON compressed files.

## Google's Protocol Buffers

The Google's [Protocol Buffers](http://code.google.com/apis/protocolbuffers/) is a binary format created inside Google for internal use and became public thanks to the 20% project philosophy.

The goal of Protocol Buffers is to serialise a message into a compact binary format with small impact on the performances and to be cross-platform and cross-language (ATM the supported languages are C++, Python, Java and C#).

First of all we declare the format of the message we will going to serialise in a `to_protobuf.proto` file:

```protobuf
package to_protobuf;

message Item {
    enum Type {
        UNIVERSITY = 0;
        BUSINESS = 1;
        LOCAL = 2;
        NATIONAL = 3;
        SPECIAL = 4;
    }

    required string repositoryname = 1;
    required uint32 repositoryid = 2;
    required Type type = 3;
    required string addressline1 = 4;
    required string addresstown = 5;
    required string addresscounty = 6;
    required string addresscountry = 7;
    required string postcode = 8;
    optional string email = 9;
    optional string pitchname = 10;
    optional string telephone = 11;
    optional string fax = 12;
    optional string url = 13;
    optional string catalogueurl = 14;
    optional string accessions = 15;
}
```

The message definition is quite simple, anyway have a look to the documentation of Protocol Buffer's proto files to discover all the options and features. Now we translate the message definition into ore preferred language:

```shell
protoc --python_out=./ to_protobuf.proto
```

and we import the generated module `to_protobuf_pb2.py` in our test code:

```python
from to_protobuf_message import Item

def get_buffer(data):
    stream = bytearray()

    for row in data:
        item = Item()

        for k, v in row.iteritems():
            setattr(item, k.lower(), v)

        stream.extend(item.SerializeToString())

    return stream

write_stream(get_buffer(get_data()), "to_protobuf.dat")
```

Protocol Buffers doesn't provide a file format, it just encode a message into a compact binary format, so in this test we concatenate every encode message into a single bytearray and we'll write it as is. Anyway as described in the Protocol Buffer's documentation you can create a root message format which can act as a container of all your messages.

The code size is pretty similar to the XML one but the size of the uncompressed data is just a few kilobytes bigger than the original one; the size of the compressed files are pretty similar to the JSON one.

## Some maths

Now it's the time to do some maths over the file sizes:

| Format           | Uncompressed | GZip compression | BZip2 compression |
| ---------------- | :----------: | :--------------: | :---------------: |
| JSON             | 1058Kb 209%  |    186Kb 37%     |     123Kb 24%     |
| XML              | 1505Kb 260%  |    192Kb 38%     |     125Kb 25%     |
| Protocol Buffers |  516Kb 102%  |    177Kb 35%     |     126Kb 25%     |
| Pickle           |  962Kb 190%  |    281Kb 56%     |     209Kb 41%     |

The table is ordered by the BZip2 column and the parcent values are the relative to the size of the original data (506Kb).

As we can see Pickle is the only loser here, the other formats after the BZip2 compression have almost the same size. Anyway, as state at the start of this long post, what I need is the best compressable format with the less code needed and the winner is JSON.

In my opinion XML needs too much code to be handle and even the better parser can have have an impact on performances when parsing a lot of data.

What is really interesting here is Protocol Buffers: small overhead, clear implementation with `.proto` files and fast performances. Surely a project to be kept in mind.
