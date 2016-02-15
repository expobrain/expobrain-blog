---
author: admin
comments: true
date: 2013-12-13 00:38:12+00:00
layout: post
slug: git-rebase-no-jutsu
title: Git-rebase no jutsu
wordpress_id: 1787
categories:
- Guides
- Troubleshooting
tags:
- command line
- git
- rebase
---

In a DVCS [rebasing](http://git-scm.com/book/en/Git-Branching-Rebasing) is the action performed by re-applying all the commits done on the current active branch since it diverged from a remote branch. That is, all the commits are taken away and re-applied over the latest version of the remote branch. 

This will rewrite the history of your branch generating new commit's SHA-1 IDs so this operation is particularly disruptive when working with different branches in the same repository can keep the history more easy to follow. In this post I'll explain how to use _git-rebase_ to clean-up your branch's commits before merging, to amend commits and even to re-order or delete commits form the history.

<!-- more -->

TL;DR



<blockquote>**Warning!! Rebasing rewrites your history and if used incorrectly can cause commits losses especially when applying some of the operations described below! Before performing any git-rebase action, _do a backup_ of your data or _push your branch_ on a remote repository. You had been warned :-)**</blockquote>





## Set up



Lets start by creating a new Git repository with one initial commit:


    
    
    $ mkdir myrepo
    $ cd myrepo
    $ git init .
    $ echo "New file" > file.txt
    $ git commit add file.txt
    $ git commit -m "Initial commit"
    



Now we have our sandbox ready to play with git-rebase. 



## Reword



You already how to amend your last commit's message or author but what's happen if you need to amend the text of multiple commits? Lets create the test case:


    
    
    $ git checkout -b try_reword
    $ echo "Second commit" > file.txt
    $ git commit -am "2nd commit"
    $ echo "Third commit" > file.txt
    $ git commit -am "3rd commit"
    



And now we are going to reword the messages of the latest two commits:


    
    
    $ git rebase --interactive HEAD^^
    



This will open your preferred command line text editor (usually `nano` or `vi/vim`) and this content will be displayed:


    
    
    pick 414d2ce 2nd commit
    pick 45df5b1 3rd commit
    
    # Rebase 8eb1d05..45df5b1 onto 8eb1d05
    #
    # Commands:
    #  p, pick = use commit
    #  r, reword = use commit, but edit the commit message
    #  e, edit = use commit, but stop for amending
    #  s, squash = use commit, but meld into previous commit
    #  f, fixup = like "squash", but discard this commit's log message
    #  x, exec = run command (the rest of the line) using shell
    #
    # These lines can be re-ordered; they are executed from top to bottom.
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    #
    # However, if you remove everything, the rebase will be aborted.
    #
    # Note that empty commits are commented out
    



This file is a list of commits with short hash and message, the word before the commit's short hash is the action which will be executed on exit from the current text editor. The default action is _pick_ which tells Git to juts replay that commit without any intervention. The other options will be displayed later int he post.

Now we are going to reword our commits so change _pick_ into _reword_: 


    
    
    reword 414d2ce 2nd commit
    reword 45df5b1 3rd commit
    



save the file and exit the editor. As soon as you exit the editor Git will replay all the commits and open an editor instance for every commit marked with _reword_: this allows you to change the commit message which will be applied as soon as you save the changes and exit the editor.

The _reword_ action is very useful when you need to amend an old commit or a series of commit because a typo or any other mistake in the commit's messages.



## Edit



The _edit_ action is more powerful than the _reword_ action, it enables you to edit the commit's message AND the commit's changes as well. 

Lets test it into a new branch: 


    
    
    $ git checkout master
    $ git checkout -b try_edit
    $ echo "Second commit" > file.txt
    $ git commit -am "2nd commit"
    $ echo "Third commit" > file.txt
    $ git commit -am "3rd commit"
    $ git rebase --interactive HEAD^^
    



Now change the first commit's action into _edit_, save the changes and exit the editor. Now Git will stop the replay at the marked commit with this message:


    
    
    Stopped at 4555f0f15d01eaa579bb7910a203264acd4bfc68... 1
    You can amend the commit now, with
    
    	git commit --amend
    
    Once you are satisfied with your changes, run
    
    	git rebase --continue
    



This leaves you the opportunity to apply extra changes to the current working tree which will be added to the changes of the current commit. You just edit the files, add them to the to the index and issue a: 


    
    
    $ git commit --amend
    



at the end. You can repeat the process more than once until you are satisfied with the result then you can continue the rebase process with:


    
    
    $ git rebase --continue
    



Note that this can lead to conflicts during the replay of the next commits. 



## Squash/Fixup



The _squash_ and _fixup_ actions are similar, both of them joins the changes of the marked commit into the previous commit; the only difference is that _squash_ joins the changes and the commit message into the previous commit instead of _fixup_ which joins the changes but discards the commit's message. 

Lets test it: 


    
    
    $ git checkout master
    $ git checkout -b try_edit
    $ echo "Second commit" > file.txt
    $ git commit -am "2nd commit"
    $ echo "Third commit" > file.txt
    $ git commit -am "3rd commit"
    $ git rebase --interactive HEAD^^
    



Now we'll squash the last commit into the second one by setting the action to _squash_:


    
    
    pick cd9d0cd 2nd commit
    squash c8cf9d8 3rd commit
    



For every commit marked to be squashed Git will open an editor instance to amend the commit message:


    
    
    # This is a combination of 2 commits.
    # The first commit's message is:
    
    3rd commit
    
    # This is the 2nd commit message:
    
    4th commit
    
    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    # rebase in progress; onto 8eb1d05
    # You are currently editing a commit while rebasing branch 'try_edit' on '8eb1d05'.
    #
    # Changes to be committed:
    #   (use "git reset HEAD^1 <file>..." to unstage)
    #
    #       modified:   file.txt
    #
    



As usual make your changes, save and exit. Using _fixup_ instead of _squash_ will skip the commit message's amend step and it'll join the commit's changes at once.



## Reorder/Delete



Reordering and/or deleting commits are the simplest operations but with a very big impact on you repository. This operations can sometimes trigger conflicts because the patch in the re-played commit can have reference to lines which are not yet in the file or to lines which has been removed.  

Reordering can be useful as a preparation to a squash of fixup operation to put all the commits together before marking them with _squash_ of _fixup_ (remember that on squash/fixup the commit's changes will be joined with the previous commit).

Deleting a commit can be used as a replacement of `git-revert` to revert back changes without leaving trace on the repository's history, however deleting commit can likely trigger conflicts.



## Conclusion



The interactive rebase is a very powerful tool to tidy your branch's history before a merge into _master_ but you need to pay a lot of attention because it's very easy to accidentally lose your changes. As a rule of thumb always push your branch into the remote repository or make a backup of your local repository; Git give you the ability to abort the rebase with `git rebase --abort` at any time but a little more of security it's always welcome.

And remember: never, never, never rebase a public branch! People can become really upset :-) 
