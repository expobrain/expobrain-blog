---
class: post-template
comments: true
cover: media/rust-code.png
current: post
date: 2016-09-18
layout: post
navigation: true
slug: create-python-module-in-rust
subclass: post
tags:
- rust
- python
- compilation
title: Create a Python module in Rust
---

[Rust](https://www.rust-lang.org) is a new language which aims to be fast a C/C++ but safer and more expressive. Writing code in Rust is not just fun but it also can be useful to write modules for Python to replace CPU-bound code with it's counterpart in Rust.

Thanks to the [rust-cpython](https://github.com/dgrunwald/rust-cpython) project it's possible to execute Python code from Rust and vice-versa build a module in Rust for Python. However the given examples and documentation shows you only how to execute Python from Rust, where in this post I'll show you how to build a module in Rust to be called by Python code.

## Requirements

The code examples in this post uses Python 2.7 or 3.x indifferently and Rust 1.11+.

If you need to compile this code for Python 2.7 a small change must be made in the `Cargo.toml` file, it will be explained further down in the post.

I'll assume that you already have a shallow knowledge about Rust and its [pattern matching](https://doc.rust-lang.org/book/patterns.html), if not don't be scared and have a look at the official [documentation](https://doc.rust-lang.org/book/).

## The first trivial example

Let's start with a simple example, a function which return an *"Hello World"* string, implemented in Rust and saved in `src/lib.rs`:

```rust
fn hello(py: Python) -> PyResult<PyString> {
    Ok(PyString::new(py, "Rust says: Hello world"))
}
```

The first notable thing is that all the functions which will be called by the Python code needs to receive as the first parameter an instance of the current Python interpreter (argument `py` of type `Python` and if they return a value it should be wrapped in a `PyResult` type (an alias to the `Result` type). Other functions not exposed to the Python code don't need these constraints.

The second thing is that the return value is a Python string and not a Rust `String` or `str` type, this is possible because the `rust-cpython` crate expose to you the Python built-in types in Rust so you don't need to return a C string and convert into into a Python string later. This is a big boost in performances because the compiler will optimise the creation of `PyString` instance and the Python code can use the instance as is without any overhead.

Now we need to expose this function as part of the module, this can be done with the `py_module_initializer!` and `py_fn!` macros:

```rust
py_module_initializer!(example, initexample, PyInit_example, |py, m| {
    try!(m.add(py, "hello", py_fn!(py, hello())));
    Ok(())
});
```

To conclude the setup let's define the `Cargo.toml` file:

```toml
[package]
name = "python-rust-example"
version = "0.1.0"
authors = ["Daniele Esposti <daniele.esposti@corp.badoo.com>"]

[lib]
name = "example"
crate-type = ["dylib"]

[dependencies.cpython]
git = "<https://github.com/dgrunwald/rust-cpython.git>"
```

Now we are ready to compile our dynamic library and call the `hello()` function from Python:

```bash
$ cargo build
$ cp ./target/debug/libexample.so ./example.so
$ python
Python 3.5.2 (default, Aug 16 2016, 05:35:40)
[GCC 4.2.1 Compatible Apple LLVM 7.3.0 (clang-703.0.31)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import example
>>> example.hello()
'Rust says: Hello world'
```

As you can see to use our `example` module is the same as importing any other Python module, no difference at all except the fact that the executed code is native C code.

## A more complete example

Now that we know hot to degine, implement and call a function written in Rust from Python code let's move to something a little more complex which involves data convertion betwfrom Python to Rust and vice-versa and a little bit of error handling.

For this example I'm going to implement a function `greetings()` which accept a string as parameter and returns a formatted greeting; all the strings will be Unicode strings and if the string passed as function's argument contains an invalid codepoint an `UnicodeDecodeError` will be raised. Here the implementation:

```rust
fn greetings(py: Python, name: PyString) -> PyResult<PyString> {
    match name.to_string(py) {
        Ok(name_str) => {
            let greetings = format!("Rust says: Greetings {} !", name_str);
            let greetings_py = PyString::new(py, &greetings);

            Ok(greetings_py)
        }
        Err(e) => Err(e)
    }
}
```

As you notice the conversion from Python's string type to a Rust's String type is done by pattern matching.

In the `Ok()` case we format the `String` instance into the greetings phrase and we convert the result back into a `PyString` instance because the API of the `PyString` type doesn't expose any method to perform string concatenation nor formatting.

In the `Err()` case we just propagate the error out of the function and up into the Python code; as per documentation of the `PyString::to_string()` method the error will be a Python's `UnicodeDecodeError` exception which can be catch and handled by the Python code.

The last step is to expose the `greetings()` function as part of the Python module (here alongside the previous `hello()` function:

```rust
py_module_initializer!(example, initexample, PyInit_example, |py, m| {
    try!(m.add(py, "hello", py_fn!(py, hello())));
    try!(m.add(py, "greetings", py_fn!(py, greetings(name: PyString))));
    Ok(())
});
```

Compiling the library, importing it and calling the function, including calling it with an invalid Unicode codepoint will raise the Python exception as expected:

```python
>>> import example
>>> print(example.greetings('John'))
Rust says: Greetings John !
>>> print(example.greetings(u'\ud83f'))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'utf-16' codec can't decode bytes in position 0-1: invalid utf-16
```

## Targeting different Python version

By default `rust-cpython` compiles against Python 3.4 or 3.5 but it's possible to compile it agains Python 2.7 as well. To be able to do that we need to specify the correct feature for the `rust-cpython` crate in our `.toml` file:

```toml
[dependencies.cpython]
git = "<https://github.com/dgrunwald/rust-cpython.git>"
default-features = false
features = ["python27-sys"]
```

## Conclusion

Rust is a very promising system language which gives you the ability to produce very fast binary code with a relatively easy syntax. Using Rust to replace CPU-bound Python code give you a boost in performace with no overhead at all on calling the Rust code from Python code; instead of calling C functions using `cffi` or `ctypes` and convert the C data types into Python data types `rust-cpython` provides Python data types in Rust directly. Optimisations applied by the compiler also generates optimal code in term of speed and memory usage.

Building a Python module is pretty easy as well and projects like [rust-python-ext](https://github.com/novocaine/rust-python-ext) are trying to integrate the compilation of the Rust code with Python's setuptools to make the entire distribution and deploy process smoother as possible.

All the code in this post is available on [GitHub](https://github.com/expobrain/python-rust-library-example).
