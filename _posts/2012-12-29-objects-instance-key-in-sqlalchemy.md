---
categories:
- Guides
- Troubleshooting
class: post-template
comments: true
current: post
date: 2012-12-29 14:05:09+00:00
layout: post
navigation: true
slug: objects-instance-key-in-sqlalchemy
subclass: post
tags:
- orm
- python
- sqlalchemy
title: 'Object''s instance key in SQLAlchemy '
wordpress_id: 1011
---

In SQLAlchemy you can query the database returning ORM objects instead of raw data from the SQL statement (if you don't know about it [this](http://docs.sqlalchemy.org/en/rel_0_8/orm/tutorial.html) is a good starting point).

Object can be fetched by the value of their primary key:

```python
session.query(<class>).get(<primary_key_value>)
```

which returns an instance of `class` with the given primary key's value.

It works only if you already know the object's class and its primary key's value but can be very helpful to extract these informations programmatically form a given ORM instance.

<!--more-->

### ORM class setup

I'll show how to do it in a minute but let's start with a basic ORM class setup:

```python
from __future__ import print_function, unicode_literals

from sqlalchemy import create_engine, Column, Unicode, Integer
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Person(Base):
    __tablename__ = "people"

    id = Column(Integer, primary_key=True)
    last_name = Column(Unicode(100), nullable=False)
    first_name = Column(Unicode(100), nullable=False)

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        return "<Person {0.id}: {0.last_name} {0.first_name}>".format(self)
```

I'm creating a simple `Person` class with a couple of fields and a better string representation when using the `print()` function.

> NOTE:
>
> I'm importing `print_function` from `__future__` because I want to use the Python 3.x behaviour of `print` which render the code to be compatible with the next major > release of the interpreter.
> The `unicode_literals` import instead force all the string literals to be unicode strings by default (again this is the default behaviour in Python 3.x).
> In my opinion it's good practice to write code more upward-compatible as possible using the backported functionalities in `__future__` to avoid surprises when you'll > run your code in the next version of the interpreter.

Now we set up a in-memory SQLite database, create all the tables and commit two `Person`'s instances:

```python

# Set up engine and session factory

engine = create_engine("sqlite:///:memory:")
Session = sessionmaker(bind=engine)

Base.metadata.bind = engine
Session.bind = engine

# Create tables

Base.metadata.create_all()

# Add persons

session = Session()

person1 = Person(id=1, first_name="John", last_name="Smith")

session.add(person1)
session.commit()
```

```bash
>>> print(person1)
<Person 1: Smith John>
```

The set up is done.

### Get instance's primary key values

By the `Person`'s class definition the primary key is the `id` field and the value for this field in the database 1.

As I told before it's easy to retrieve the row form the database by querying for its primary key's value, but you need to know the class of the ORM instance and how the primary key is defined (usually the primary key is bound to only one column, but in some cases you can have classes with a composite primary key which is bound to multiple columns).
The `Session` instance can return these informations by the [`identity_key()`](http://docs.sqlalchemy.org/en/rel_0_8/orm/session.html?highlight=identity_key#sqlalchemy.orm.session.Session.identity_key) function:

```python
ikey1 = session.identity_key(instance=person1)
```

```bash
>>> print(ikey1)
(<class '__main__.Person'>, (1,))
```

`identity_key()` returns a tuple where the first element is the class of the ORM instance and the second element is a tuple of its primary key's values.

This tuple is the session's instance key and it has the advantage to be completely unbound from the instance or from session thus can be used outside the session's or SQLAlchemy's boundaries (for example it can be safely pickled/unpickled).

Querying the database it will be much easier because you will not need to hardcode the ORM class in your query thus your code will be more flexible and robust in case of any changes in the ORM class's definition.

### Querying by the instance's key

Time to put in practice what we talked about:

```python
del session, person1

session = Session()
cls1, pkey1 = ikey1
person1 = session.query(cls1).get(pkey1)
```

I'm deleting any reference to the previous session and `Person` instance, creating a new session from scratch, unpacking the instance's key tuple into class and primary key's value and using them to retrieve the person again from the database...

```bash
>>> print(person1)
<Person 1: Smith John>
```

..and there it is, nice and easy.
