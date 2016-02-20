---
author: admin
categories: [Guides]
comments: true
date: 2012-10-18
image: {url: /media/2012/10/iOS-4-1-4-0-3-May-Arrive-as-Early-as-This-Week-2.png}
layout: post
slug: use-custom-sqlite-database-with-ios
tags: [c/c++, ios, object-c, sqlite]
title: 'Use custom SQLite database with iOS '
wordpress_id: 919
---

Core Data is the framework available on iOS to allow to store data on the device using a common API without worrying about the storage backend. It's very powerful but if you are creating and managing the data from your app. However, if you are providing your custom SQLite database bundled within the app, using Core Data directly will be difficult.

<!-- more -->

The scope of Core Data is to separate the data from the storage system and, in case of a SQLite database, creating a database schema which will be compatible with the Core Data needs can be a expensive and futile task: the modified ER model can incompatible with yours and any new version of Core Data may require to change the schema again.
A more easy solution is to distribute your SQLite database bundled with your app and access it directly by the [SQLite C API](http://www.sqlite.org/capi3ref.html)s bypassing the Core Data framework.
First in Xcode open the project settings, switch to the _Build Phases_ tab and expand the _Link Binary With Libraries_ section:

[![]({{ site.url }}/media/2012/10/ios_sqlite_01-300x251.png)]({{ site.url }}/media/2012/10/ios_sqlite_01.png)

Now press the _+_ button and search for the SQLite dynamic library in the list:

[![]({{ site.url }}/media/2012/10/ios_sqlite_02-300x258.png)]({{ site.url }}/media/2012/10/ios_sqlite_02.png)

Select the _libsqlite3.dylib_ library and press the _Add_ button.
Expand the _Copy Bundle Resources_ section and add your SQLite database to the list:

[![]({{ site.url }}/media/2012/10/ios_sqlite_03-300x251.png)]({{ site.url }}/media/2012/10/ios_sqlite_03.png)

Now we need a method to retrieve the full path and filename of our database from the app bundle:



    - (NSString *)databasePath {
        return [[NSBundle mainBundle] pathForResource:@"marsuite" ofType:@"sqlite"];
    }



Pretty easy! With the filename we can finally access the database and query it:



        sqlite3 *database;
        if (sqlite3_open([[self databasePath] UTF8String], &database;)) {
            sqlite3_close(database);
            NSAssert(0, @"Failed opening the database");
        }

        NSString *query = @"your query here";
        sqlite3_stmt *statement;
        if (sqlite3_prepare_v2(database, [query UTF8String], -1, &statement;, nil) == SQLITE_OK) {
            while (sqlite3_step(statement) == SQLITE_ROW) {
                ...
                code to load the data form the db
                ...
            }
            sqlite3_finalize(statement);
        }

        sqlite3_close(database);



This piece of code is a standard pattern to load data from SQLite in C, you will just need to implement your custom code inside the inner `while`.
Anyway, remember the database will be read-only because it's bundled with the app and the size of the app will increase by the size of the database.
