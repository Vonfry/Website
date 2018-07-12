---
title: macos commandline version
date: 2018-07-12 09:30:52 +0800
categories: dev
tags: macos
---



## 起因

安装llvm时出现了编译错误，准确来说是lldb时。



## 解决过程

去brew上提了个issue。发了各种信息。



然后发现CLT version是10，而xcode的version却是9。



如何导致出这个情况的还不清楚。但整体来说是两者混合使用导致的。



## 检查方式

经过查找。在macos上，可以使用`pkgutil --pkg-info=com.apple.pkg.CLTools_Executables`来检查clt的版本信息，而xcode的信息，可以通过app中的关于或者xcode自带的clang、llvm等工具添加`--version`参数查看。注：一定是xcode自带的版本，而不是自己安装的其它版本。



## 解决

现在CLT全部安装在`/Library/Developer/CommandLineTools`下面，可以直接`rm -r`掉。不删除应该也ok的。



前网[developer.apple.com](https://developer.apple.com/download/more/?=for%20Xcode)下载正确的版本。最好是和xcode版本对应。
