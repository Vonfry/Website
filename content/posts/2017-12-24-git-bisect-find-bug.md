---
categories: 
- develop
date: "2017-12-24T19:32:21Z"
tags: 
- git
- bug
title: 使用git查找bug
---
<!--more-->

# 使用
git有一个指令为`bisect`，可以使用这个进行commit标记，来进行bug追踪查找对应的提交，从而发现bug位置，当然……前提是你的commit是严格按照一个commit为一个atom这样的概念进行的。

# 参考

博客：http://www.techug.com/post/git-bisect-debug-method.html

git文档：https://git-scm.com/docs/git-bisect

