---
categories: 
- develop
date: "2017-11-05T12:49:38Z"
tags: 
- emacs
- intero
- irony
title: 开发工具相关插error记录
---

最近因为一些原因`intero`的插件各种报错。后来结果重新安装一下就搞定了。这里特别记录一下。

去查了一下issue，原因似乎是因为某些动态库导致的。

当所用的插件需要编译或者外部依赖时，如果使用过程中出现未知的错误（即不是插件本身输出的errro信息），可以尝试去重新编译或安装一下对应的依赖。说不定就能处理了。

