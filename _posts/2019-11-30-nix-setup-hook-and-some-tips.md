---
title: nix setupHook和一些tips
date: 2019-11-30 16:03:27 +0800
categories: dev
tags: nix build hook
---

之前已经写过一篇关于nix的配置相关的博客，这次是再一次遇到了新的问题，而对
setupHook进一步理解后写出的。主要针对`NIX_CFLAGS_COMPILE`和`cc-wrapper`等内建的
hook进行了一次理解。

问题首先为成两个主要部分。
1. cc-wrapper是何时被调用的，在cc-wrapper的setup-hook里没有调用到cc-wrapper，且
   `stdenv/setup.sh`内也不存在setup-hook以外的特殊脚本调用。
2. setup-hook内，以及各种build-support内，没有任何对`NIX_CFLAGS_COMPILE`进行
    配置的地方，在nixpkgs也是同样（除了部分configure等有兼容性问题的地方）。那么
    nix是如何使用这个变量，而又不去设置`CFLAGS`等变量的（其实有点剧透了，因为最
    初的想法应该是何时把`NIX_CFLAGS_COMPILE`传过去的）。

这两个问题其实是同样的，因为都是wrapper的内容。这两个问题之外，就是一些小细节了。

<!-- more -->

## cc-wrapper/bintools-wrapper

注：下文以cc-wrapper为例，其它的wrapper也大同小异。

这类内置wrapper本质是一个drv，也就是一个软件，而所谓的cc-wrapper根本不是
setup-hook，在nixpkgs文档内这部分写到了setup-hook内，但他setup-hook的是自动加入
依赖进`NIX_CFLAGS_COMPILE`，而是给GCC等传入这个参数。当然传入参数这一过程也是由
这些wrapper实现的，但不是由setup-hook实现的。那么是哪里现实的呢？

答案在cc-wrapper的drv里。在installPhase内，有一个wrap的shell函数调用，而这一调用
就是把`cc-wrapper.sh`这一文件进行的替换。把gcc、clang等常用的一些编译器，用
cc-wrapper替换掉了，而cc-wrapper干了什么？那么去看`cc-wrapper.sh`，其实就是把
`NIX_CFLAGS_COMPILE`等`NIX_`的环境变量直接传入给wrap时打包的程序。比如，wrap了
gcc，那么cc-wrapper最终就会执行`gcc $NIX_CFLAGS_COMPILE ...`这样的语句。当然，
wrap不止做了这些，但这是我所关注的，此外做的还有一些参数的传递、hook的调用等。

这样做除了可以传递CFLAGS外还有什么好处？在configure后一般会生成Makefile，或是有
些Makefile内会需要你人为设置一些CFLAGS，而这些CFLAGS可能会因为各种原因被覆盖，比
如Makefile的强制赋值。常见的就是configure会生成Makefile.inc，里面包含固定的
CFLAGS。除非我们人为了去修改Makefile.inc（通过patch等手法），或者在configure之前
设置CFLAGS，才有可能使编译正常。而CFLAGS在configure的过程中是可能被修改的，这样
有可能导致部分依赖的丢失或错误。那么我们把编译器做个wrap，所有的`$(CC)`还是存的
编译器的名称，如gcc，但gcc不是纯粹的gcc这个程序，而是先对参数进行处理再传递给gcc，
在兼容性方面会有更强的优势。不同于使用CFLAGS等变量带来的不稳定性。

做个对比：
```shell
echo $(CC) # = gcc
cat $(which $(CC)) # = gcc-wrapper which call gcc with NIX_ variables
# equal: gcc $NIX_ ...
$(CC) $CFLAGS ... # CFLAGS may break by configure or configure-hook.
# equal: gcc $NIX_ ... $CFLAGS ...
```
与
```shell
echo $(CC) # = gcc
cat $(which $(CC)) # = gcc
$(CC) $CFLAGS
```

## tips

今天要写的主要是**环境变量**和`./configure`。

### 环境变量
不同于大部分主流系统（如Ubuntu），这类系统是不默认导出CC、AR等变量的。而是由
configure自动配置。而configure自动配置中，以autoconf生成的configure默认是会检查
这些变量的存在，然后再进行赋值，而其实比较特殊的是AR。AR正常是需要一个操作参数的，
但这一参数在部分configure中，会分给AR变量，比如`AR=${AR:-${ac_tool_prefix}ar
cr}"`，而这样一来，默认有AR变量但又没有传入参数（即`AR=ar`）的情况，在后续
Makefile中就会出错。解决方法也简单，要么做为设置`ARFLAG_OUT`传入，要么在
`preConfigure`中先`export AR="$AR cr"`就好了。至少，nix-build环境下的AR变量默认
是只有AR的。当然也可以打个patch，不过用`preConfigure`更加通用吧。毕竟patch随软件
更新可能会需要重新生成的。

### `./configure`

另外一点是`./configue`。上文提到了configure生成CFLAGS，但有时，还会对依赖进行检
查，但是nixpkgs因为已经处理了编译依赖了，没有传递CFLAGS，在configure中检查的
CFLAGS自然也是空的。不过问题不大，因为检测依赖的方法多数是用CC进行编译一个很简单
的测试文件来完成的。所以不会出问题。那么我为什么要写这个内容？因为我出问题啦！在
我不知道cc wrapper的时候，我对CFLAGS传入的`NIX_CFLAGS_COMPILE`，结果因为
configure生成的split CFLAGS错误而出了好久。这里又要分开说明了。

为什么我要传入CFLAGS，因为qtbase的依赖没有被正确的加载，`qtbase/include`被自动加
入了，但是有些人写代码，他就是不写二级目录。比如`#inuclude <QtCore/QQueue>`，有
人写成`#include <QQueue>`，需要人工去加入二级目录（我不太清楚`qtlib.callPackage`会
不会完成这个工作，因为没有尝试。），而一开始，我为了通过编译就直接加入CFLAGS了
（因为当时还不懂`NIX_CFLAGS_COMPILE`的原理以及这个问题出现的本质，只为了通过检查
就直接加CFLAGS，而正好CFLAGS又会被生成到Makefile.inc，做为编译参数的一部分被使用。
所以看起来并没有出现问题）。而configure split中以空格为分格，是的以空格，而我传
入的是`-isystem <path>`自然就不对了（常用的是`-I<path>`和`-L<path>`）。当然用哪
个没太大区别，`-I`和`-L`分别是头文件和库文件目录。而`-isystem`是在系统头前，可以
理解为系统头文件的一部分，而对于依赖我也更倾向于使用`-isystem`而不是`-I`和`-L`，
后二者更倾向于自己添加的include和编译出来的lib，不属于安装到系统上的依赖。

我也正是因为上述这个问题，才去追查`NIX_CFLAGS_COMPILE`和`CFLAGS`到这一步的。虽然
绕了一大圈（而且处理问题的初始方向完全错了，正确的应该是发现include子目录的问
题。），但对nix又有了进一步了理解，问题也处理好了，最后nix的drv也写得比较好看了
一点，可喜可贺。
