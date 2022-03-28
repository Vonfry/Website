---
categories:
- develop
date: "2021-05-18T18:09:38Z"
tags: tensorflow build tmpfs shm
title: 临时文件目录空间导致的编译失败
---

## 起因

使用 nixpkgs 中定义的 tensorflow-gpu 时，编译过程中出现了 `/build ... no space` 类似的错误。
<!--more-->

## 原因

原因很简单，`/tmp` 使用的是 tmpfs，而不是硬盘，从而空间不足，因此会产生这样的问题。习惯上 `/tmp` 会是内存大小的一半。

进一步，我上述的问题并不是因为 `/tmp` 空间不足导致的，而是其 `inodes` 不足产生的。

## 解决

临时的解决方案就是调整尺寸和 inodes 数量重新挂载一下 `/tmp` 就行了。

```shell
mount -o remount,size=80G,nr_inodes=0 /tmp
```

其中 `nr_inodes` 调整的是 tmpfs 的 inodes 数量，为 `0` 即不限制。具体的内容可以参考内核中 tmpfs 的文档。

### NixOS 特例
在 NixOS 中，如果使用 `boot.tmpOnTmpfs` 来配置 `/tmp` 挂载为内存的话，其大小是在 `<nixpkgs/nixos/modules/system/boot/tmp.nix>` 中定死为内存一半的，如果需要更换大小需要使用 `mkForce`、`mkOverride` 等方式来更换启动时挂载的大小。

## 关于 shm
在处理这个问题时，发现 `/dev/shm` 与 `/tmp` 不是同一个东西。经过查找资料，可以总结如下，`/dev/shm` 必定是映射进内存的，而 `/tmp` 可以为硬盘且此目录为 *nix 的标准。换句话说，如果想要 `/tmp` 为内存的情况下，也可以简单从 `/dev/shm` 内进行软链接。
