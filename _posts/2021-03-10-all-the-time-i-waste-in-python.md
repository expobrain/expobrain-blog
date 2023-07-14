---
class: post-template
comments: true
cover: media/time.jpg
current: post
date: 2019-03-10
layout: post
navigation: true
slug: all-the-time-i-waste-in-python
subclass: post
tags:
- python
title: All the time I waste in Python
---

It's now almost 20 year that I'm using Python as my main programming language. I used it for both small or pet project to big long lasting commercial products with ease and satisfaction.

I learned it back in the days when version 2.4 was around and I really liked how easy was to write a program in a very elegant and clean way, the ability to quickly prototyping applications, the active community and a vast selection of high quality packages.

During the years Python grew in terms of features and tooling; with the migration to version 3.x (even if the migration process was not free from issues and delays) it gained more modern and useful features like unicode strings as defaults and annotations.

Until now I never though seriously to switch to another programming language but if I look at what are the steps to efficiently and safely write medium to complex applications in Python nowadays I'm starting to pondering if it's the time to do so.

Lately I found myself "wasting" my time on setting up the proper development environment, tooling and CI configuration to ensure that my Python codebase is up to the industry standards and it's formally correct during both development and maintainance stages.

Here I'm going to list what features and tooling I'm using today on the Python projects I'm working on and their pro and cons.

## Annotations

![Python type annotations example]({{ site.url }}/media/python_type_annotations.png)

[Annotations](https://www.python.org/dev/peps/pep-0484/) where a very big deal when they were released in Python 3.5, without them we will not have all the amazing tooling we use today for automatically generate documentation, API specs and statically analyse our codebase with [Mypy](https://mypy.readthedocs.io/).

They are not an overhead when writing Python code, on the contrary they helps on defining, documenting and ensuring the correctness of your code.

Because annotations are not enforced at runtime (for obvious reasons) they are not a waste of developer's time if and only if the proper tooling is set up in the development environment to ensure that the annotations matches the actual code and any mismatch is fixed. Otherwise they usefulness is limited, they will be just an extension of the code's documentation and nothing else.

## Mypy

![Mypy]({{ site.url }}/media/mypy.svg)

Mypy is the most important tool of the list, it's a static code analyser which leverages the Python annotations to analyse the code before execution and identify places where the types of values in variables and in function's arguments don't match the annotations.

Mypy is still continuously improving in every release so more and more cases and checks are added to improve the quality of the analysis and detecting more issues. It's mandatory for every project from small to big size.

On the other hand because it was build to progressively analyse existing codebases with or without annotations it can be configured to be less strict on certain situaions and able to exclude entire packages from the static code analisys with all the potential consequences.

Third party packages need to esplicitly support Mypy by [different ways](https://mypy.readthedocs.io/en/stable/installed_packages.html#making-pep-561-compatible-packages) depending on how the code is packaged and distributed by the package's maintainers.

Also checking code with Mypy becomes really effective only if this tool is run as part of the CI pipeline and the build fails if Mypy reports any error.

## Flake8

![Flake8]({{ site.url }}/media/flake8.jpg)

[Flake8](https://flake8.pycqa.org/en/latest/) is a tool to enforce style guides on your code, it's not a mandatory tool for your productivity except for a couple of features.

The first one is that it will detect unused imports and variable assignments, task which Mypy don't do, which is important to keep the code lean and efficient.

The second is that it can be [extended with plugins](https://github.com/expobrain/flake8-datetime-utcnow-plugin) with customised Flake8 rules which are specific for you project or team.

It would be nice if Mypy would integrate this features during the static code analysis so to not have to rely on another tool.

## Vulture

![Python Vulture example]({{ site.url }}/media/python_vulture_example.png)
All the tools and features mentioned above do a great job to ensure that in your code you are using the correct types in variables and function parameters. However of course this is not enough and you still need one last tool to detect unused code and function arguments like [Vulture](https://github.com/jendrikseipp/vulture).

Again, this kind of check could have been performed by one of the tools mentioned above (the most obvious candidate is Mypy) instead of having another tool in the pipeline.

## Conclusions

I'm wondering if the problem is not in the awesome tools themselves or in their fragmentation but in the way we using the Python language nowadays. We are writing code with a fully dynamic language but we are pretending that it's a fully statically typed language with types, which are just optional annotations to the core, and a compiler in the form of Mypy, which is just a tool that checks your optional annotations.

Are we then probably using the wrong language? Should we move to static languages like [Kotlin](https://kotlinlang.org/) or [Rust](https://www.rust-lang.org/) instead of continuing lying to ourselves?

Or should Python follow the idea of [TypeScript](https://www.typescriptlang.org/), having a superset of Python with true types which uses type inference and annotation to statically check and [transpile](https://en.wikipedia.org/wiki/Source-to-source_compiler) the codebase into plain Python, maybe also at any desired version dependign by our target environment?

This is the kind of question I'm asking myself, for me working with Python nowadays is getting more difficult and I'm not feeling fully productive and confident about the code I write; the tooling feels to me jus like a thin blanket which covers only a minimum part of my needs.
