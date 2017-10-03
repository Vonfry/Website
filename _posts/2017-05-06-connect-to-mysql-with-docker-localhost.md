---
title: 连接本地docker内的mysql
date: 2017-05-06 19:57:49 +0800
categories: os
tags: docker mysql datebase server
---

# 问题描述
docker开起一个对本地的mysql后（Port已设置），但运行`mysql -u root -p`后会出错

# 解
其实是`mysql`对`localhost`这个地址，会自动检查本地的进程，然后不是通过一般网络访问，而是直接进行套接字串输，而对于我们用docker，当然没有sock文件和对应的进程啊！！

解法一种是改Mysql设置，把配置中的sock文件改改，改成docker中的。或者最简单的，在连接时，显式把host设置成127.0.0.1，或者其它本机ip。这样就可以了……


