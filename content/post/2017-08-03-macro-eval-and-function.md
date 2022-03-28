---
categories: develop
date: "2017-08-03T22:51:21Z"
tags: emacs lisp
title: 宏，eval，函数
---

本文以lisp为主
<!--more-->

# 函数(function)

函数就是一个子程序，执行即运行求值

# eval

求值，不过工作于用户层

# 宏(Macro)

与函数类似，但是不是用来求值，而是计算求值过程。然后调用后执行求值过程。

但又与eval不同。eval是在执行中解析且运行，而宏是编译期先计算过程，之后同函数一样。这个与C语言一样，编译期展开，所以在效率上要高于eval。
