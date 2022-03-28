---
categories: 
- os
date: "2018-03-11T13:36:25Z"
tags: 
- gentoo
title: gentoo配置makeopt
---

## 问题说明
emerge编译llvm时，各种自动killed，一开始还以为是用的vps限制掉了，后来加上`-v`后发现ninja居然有`-j999`的参数
<!--more-->

## 原因
在`make.conf`中的MAKEOPT，设置`-j`没有加上对应的并行数，默认情况下，这个参数是给make用的，而make没有并行数，也就是不设置的情况下是无限制，但是在部分makefile中，这样会导致使用其它工具而传入错误的参数。llvm的makefile内ninja的`-j`是由make提供的，所以必须设置。

## 正确设置方式
可以查看[gentoo文档](https://wiki.gentoo.org/wiki/MAKEOPTS)

简单来说，根据`lscpu`的返回cpus数进行设置就ok了。



