---
layout: post
title:  nixos install
date:   2020-07-14 09:47:08 +0800
tag: nixos os
categories: develop
---

记录几个nixos安装时的问题。

1. 关闭bios的secure boot，这是windows强制默认开启的，但这会导致U盘无法启动
2. 关闭fastboot，这也是windows的，这会导致内核模块iwlwifi无法被加载，从而无法使
   用无线网络
