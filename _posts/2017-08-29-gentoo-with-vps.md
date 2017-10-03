---
title: 在vps中安装gentoo
date: 2017-08-29 14:17:23 +0800
categories: os
tags: gentoo linux server
---

基本过程和平时安装一样的。参考[Handbook](https://wiki.gentoo.org/wiki/Handbook)就好了。需要注意的有几点。

## 分区

对于虚拟化的情况，硬盘使用的是`/dev/vda`，而不是家用机中的`sda`。在fstab配置的时候，也没有必要去配置cdrom等没关的东西。

## 内核编译

大部分情况下，需要开启`VIRTIO_PCI`与`VIRTIO_MMIO`，以及其它的几个选项。参考：[Wiki](https://wiki.gentoo.org/wiki/QEMU/Linux_guest#Kernel)

## Grub2 配置

注：以下本人使用的grub2并没有对应参数。。嗯。有点迷。。可能是文档有点旧的原因。

如果在硬盘使用为vda的情况下，需要添加并修改`/boot/grub/device.map`。同时需要使用`grub-install --device-map`。参考：[Wiki](https://wiki.gentoo.org/wiki/QEMU/Linux_guest#GRUB)


## 开启Docker

参考：[Wiki](https://wiki.gentoo.org/wiki/Docker)

吐槽：选项真多。要是有什么脚本一次处理就好了。

## 更多虚拟化相关资料

[Wiki](https://wiki.gentoo.org/wiki/Category:Virtualization)




