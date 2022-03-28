---
categories: 
- develop
date: "2020-09-30T23:16:21Z"
tags: 
- os
- linux
- nixos
- windows
title: efi、systemd-boot与grub及双系统问题
---

最近在工作站上装nixos遇到了引导问题。大概为我配置了grub，但是开机却不能引导，行为是直接启动了windows，简直就像是uefi没有查找到linux的efi一样（事实也是的）。

这个问题其实之前也有遇到过，但当时因为不明不白的给跳过了，所以没有详细去理解，甚至没有发现这个问题。因此在此记录。

<!--more-->

## 原因

原因很简单，grub不会生成efi文件，他会生成一个给efi使用来调用及grub自己的配置，但不会生成efi本身，efi本身的生成需要使用systemd-boot来生成。因此这二者的关系就非常明确，systemd-boot提供给uefi查找的efi，而grub则让systemd-boot启动后不是直接进入系统，而是调用grub来完成后续的引导，或者说，是由grub来生成供efi引导的entries。

## 问题注意点（针对NixOS）

NixOS的boot不像是etc、run等目录一样严格管理的。boot目录是非纯的。因此，在最初安装系统时，会自动为你配置systemd-boot与efi，那么他们就一直会存在，除非你自己去删除boot目录下的文件。哪怕你之后把systemd-boot设置成了false也是会存在的，因为他不是使用软连接等方式，也不保证是纯的。

## grub查找系统

wiki上有提及正常的efi会自动查找到其它系统，但这里有个**大前提**，就是所有系统使用的是同一个efi分区，然后各自写入自己系统的efi文件。但是当你是多硬盘的时候，操作系统的efi经常会写入自己硬盘内的efi，这个过程是比较难控制的（你需要挂载其它硬盘，这在linux很方便，但windows是很难选择efi分区的吧。至少我不太清楚是否可以选定efi分区）。而如果我们使用windows的efi分区做为引导的话，那么systemd-boot可能就会成为不需要的东西了（没有测试过）。

所以grub配合osprober与efibootmbr可以自动查找系统并加入entries（efi分区不共用的情况）。只不过当grub不使用legency时，必需要有一个efi boot才可以使用，grub本身并不存在这个功能，这点需要明确。当然，不使用grub，而是人工来使用efibootmbr等工具来创建efi的entries也是可行，只是不如自动化来得舒服就是了。

## 引导修复（针对nixos）

非nixos可以直接livecd启动然后挂载、chroot、重建引导就行了。

但nixos在chroot时需要一些trick。详细的可以见[wiki](https://nixos.wiki/wiki/Change_root)。但也是可以的，而不需要你每次去做一遍nixos-install（最初尝试失败时，为了时间效率，直接install了。）简单来说，nixos提供了nixos-enter就是用来干这个的。手工过程可以参考脚本或者前面的wiki。
