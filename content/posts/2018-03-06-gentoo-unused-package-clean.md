---
categories: os
date: "2018-03-06T22:36:01Z"
tags: gentoo clean
title: Gentoo清理不需要的包
---

首先，要说明，这里所有的不需要并非指不依赖，本文主要说明如何处理掉未知的依赖项，然后清理掉不需要的软件。
<!--more-->

## depclean
最先跑一次depclean，这是最简单的处理方法了，但如果出现某些情况则不可用了。这时优先去按提示把所有缺失的补上，至少这样可以保证系统正常运行

## 循环依赖
本文写的主要因素为：有些时候（笔者是ruby），ruby2.3居然依赖到了ruby2.2，准确来说是ruby2.3的某一项被依赖到ruby2.2了。类似的情况还存在于python。

## 处理
方案一：检查依赖，使用`euse -I <use flag>`，`equery d <atom>`与`eix --installed-with-use <use flag>`进行查看。确认你不需要的内容是否是被其它包所依赖。然后清理之。

方案二：检查`use flag`，特别是对于某些`global use flag`，如：`doc`等。

方案三：方案一得出来的所有包，删掉，然后把旧的删除，然后尝试newuse，当然带上tree，也就是`emerge --pretend --newuse --update --tree @world`来确认依赖状态。然后再去查use flag，基本上，锅就是flag的。

## 特别地
有些包，强制依赖到旧的包，大部分时候，会被`xx_targets_xx`这类变量以及portage捕获到，但有些情况下，比如ebuild写得不完善，会出现没有提示的依赖，这时就只能按方案一慢慢查，然后去决定是否留去。

## 感想
尽可能不在`make.conf`等全局`use`变量中写入use，哪怕是`global use`。

只写那些自己真正需要的，自定义就要这样，但是有时人总是贪心的，会觉得，这个东西很有用，以后我也会用到的吧，就先安了，然后最后发现flag有一大堆。等以后真正有需要时再去装就好了。仅保留最小限度的flag（大概）。



