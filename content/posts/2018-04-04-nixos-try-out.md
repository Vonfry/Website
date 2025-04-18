---
categories: 
- os
date: "2018-04-04T16:07:14Z"
tags: 
- nixos
title: nixos试用
---

在虚拟机大概跑了一下，说一下感觉吧。最后的感觉是暂时弃用了。（至2020年，已经完全切换过来了）

安装，很方便。比arch和gentoo相比轻松多了。只要配好分区，一个`nixos-install`就行了。就是对于`gpt+bios`好像有点问题。

使用，全部都是配置配置配置配置！！然而，~~我并不能很方便在系统内查找配置信息，虽然有`nixos-options`与`nix-repl`，但这些信息量不全，前者只能精确查找！唯一的方案就是上网页去查。gentoo虽然也有网页，但是完全可以在系统内进行查询！~~文档可以通过本地`man configuration.nix`或者nixos-options以及`nix repl`来查看。因为配置带来的其它问题就是很多使用习惯的问题。以及用户配置的语法是一个很大的坑。没有仔细看文档是我的问题，但是部分文档很不全。说明也不充分。但熟悉haskell的话，nix相对来说还是比较友善的。

~~全配置~~nix带来的另外问题就是目录和标准linux不一样。很多系统层只能使用配置来完成，而对于开发，由于没有深入设置，所以不好说什么，总有种感觉配置会和软件本身的配置冲突的感觉。

另外一个很严肃的问题在于，用户的配置也要依赖于全局的配置！而不是用户个人，[相关讨论](https://www.reddit.com/r/NixOS/comments/6izuqh/etcnixosconfigurationnix_vs_confignixpkgsconfignix/)，~~到现在为止，似乎也是这样的，这个不是很喜欢呢，~~虽然计算机一般而言就是由系统管理或者单一用户。多用户对于服务器目的在于管理服务，似乎也不太需要这样那样的需求，但总是觉得什么地方心理不舒坦啊。可以使用home-manager进行维护个人使用的部分。~~这也是放弃使用这个系统最大的因素吧。~~

用户较少是另一个因素，导致有些问题处理不全面，相比gentoo一类的虽然用户少，但是相对而言的少，他是有大量人员在维护的，而nix这方面则弱很多。（nixpkgs的pr合并效率时快时慢。但主要的一些软件都有专门的人在维护。而小版本号的更新也有机器人自动更新。）

最后一个非常重要的就是文档了。gentoo、archlinux或是其它的，都有自己的文档，而且相对全面，不全面的参考archlinux都可以了。但是nix的文档太薄弱了。不说其它的包，系统自身的描述都不明确，很多地方说明不清。需要通过阅读nixpkgs的源代码才可以有较好的理解。或者准确来说，是部分文档以注释写在代码内，但没有生成为单独的文档，至2020年8月，有第三方工具可以查找这些文档。

总体感觉，这是一个不错的思考方向，但日常使用还是先放弃了。以后有机会可以再去试一试。

不过那个包管理还可以，如果不和系统耦合过深是可以考虑一下的吧。主要优势在于可复现，同样的配置文件可以复现回同样的系统。而其它系统可能会需要人为的介入。

EDIT: 2020-08-16 修正部分观点
