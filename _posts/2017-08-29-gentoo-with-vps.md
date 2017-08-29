---
title: 在vps中安装gentoo
date: 2017-08-29 14:17:23 +0800
categories: server
tags: gentoo linux
---

基本过程和平时安装一样的。参考[Handbook](https://wiki.gentoo.org/wiki/Handbook)就好了。需要注意的有几点。

## 分区

对于虚拟化的情况，硬盘使用的是`/dev/vda`，而不是家用机中的`sda`。在fstab配置的时候，也没有必要去配置cdrom等没关的东西。

## 内核编译

大部分情况下，需要开启`VIRTIO_PCI`与`VIRTIO_MMIO`两个选项。



