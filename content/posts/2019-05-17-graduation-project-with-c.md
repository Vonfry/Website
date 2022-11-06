---
categories: 
- develop
date: "2019-05-17T08:32:01Z"
tags: 
- C
title: 毕设遇到C语言相关记录
---

## 起因

最近做毕设，题目是以ARM与Linux为基础的一些设计，由于是第一次接触嵌入式设计，再加之C语言学完已经有快7年了，平时不怎么用。虽然当初刚学习的时候看了相当多C/C++的书籍，很多知识细节也知道，但真写起来还是遇了不少坑，在此记录一下。

<!--more-->

## 交叉编译

使用的开发板默认提供的是gcc4.4.1，各种编译不通过，最后是使用docker才完成的。但其实可以编译高版本的gcc，但是这种情况下，需要重新链接libc库。

此外，默认提供的交叉编译器使用的是全局硬编码的方式写入工具链和库，而不是动态查找的方法，在NixOS上无法正确运行，必须进行虚拟化。

在设计软件时，进可能使用动态编码查找相关数据，命名约定的存在就意味着存在非标准的情况。根据约定的使用环境不同，特别是系统这类大型环境，必然存在想法不一样的设计思路。

2019-09-20增：如果需要编译低版本的编译器，主要有两种方案，一种是拉取二进制（如docker或通过旧的发行版），二是高版本一步步编译出低版本，过大的跨度是不行的，需要一层层向下编译，同时编译过程中需要注意编译选项等操作。

## 链接时报错：重复定义

使用`#ifndef`等手段，可以有效避免头文件被重复包含导致全局变量被重复定义，但是编译过程中是针对每个文件进行编译，最后再进行链接。也就是说，如果多个c文件包含同一个头文件时，每个c文件生成一个obj，都会对这个头文件内的全局变量分配命名，链接期就会出现重复定义的问题。

解决方法有两种，一种是用static进行修饰。原理是static修饰的情况下，只有第一次定义会明确分配命名，而后面再出现，并不会。这一手法比起全局变量，更适合使用在函数体内，比如MFC中的getAppliction（有点记不清是不是这个名字了）。

另外一种解决方法是，头文件内所有声名加extern，也就是仅使用声名，不进行定义。定义放到C文件内，由编译期确定。链接时只会检查多次重复声名，而不会检查到重复的定义，定义仅会存在于一个进行实现的的obj文件内。