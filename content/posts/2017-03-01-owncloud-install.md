---
categories:
- os
date: "2017-03-01T16:54:00Z"
tags:
- owncloud
- fedora
- server
title: owncloud安装问题记录
---

今天又把服务器安装了一个owncloud玩玩，虽然主要数据还是存在dropbox上的就是了。

这里主要写一下配置问题吧。中间被坑了几次（其实是 本人理解有问题可能）

# 网页安装过程
网页安装过程，在填写数据库信息时，最重要的！！切记的是！！这个用户名和密码，是指拥有mysql管理权的，不是单个库管理权的，因为oc会在这个过程中，创建一个专门用来管理库的用户（没有必要我们自己提前建立）。当然，库还是要提前准备的，这里不一定要写root，只要是有创建用户、修改数据库权限的用户就行了。然后会根据一开始写的管理员用户，来创立一个专门管理这个oc库的用户。用习惯wordpress或者之类的东西后，会有点定向思维了。呵呵。

# Nginx与Apache

这个主要是本人能力问题，因为想建Nginx与Apache双服务器的。一开始只是单纯的把所有请求都专到Apache上，不过这样不行的呢。对Nginx也要有一些设定，而且Apache不能完全按官网上，博主这里是用的fedora dnf包里的owncloud-httpd，他会默认把所有设置包到最外层。这样必然会有影响，最后的解决方案是把Nginx与Apache的官方配置各用一部分，然后再把Nginx上转到php的部分给换成转到apache就好了。

最后要注意一点，因为oc内部会根据请求的url来生成网站内的链接，所以在nginx中，还要设置好proxy_host等信息（这个其实比较常见，只是博主一般都是写python什么的，依靠uwsgi，都是现成部品，完全没有关心过这些）。

还有一点是关于X-XX保护的，需要关一下……毕竟是从原域名跳到的localhost，虽然也能写成一样的，不过写本地以后万一改起来会简单点。
