---
categories: 
- develop
date: "2020-06-30T18:34:33Z"
tags: 
- nix
title: nix derivation
---

今天在想要不要把home-manager内的zsh plugins换成impurer的fetch时想到的问题。nix derivation是怎么计算hash的，为什么使用`fetchFromGethub`这类由stdenv定义的fetchur就没有问题，而原装的就不行呢？

简单来说就是看源代码。

## nixpkgs的fetcher

定义在`<nixpkgs/pkgs/build-tools/fetch...>`中。主要关注`fetchgit`和`fetchurl`，因为其它的大部分是基于这两个的，会发现他们最后得到的是个drv。即，通过drv来判断文件是否符合我们所需。

## nix的drv

需要先明确，`stdenv.mkDerivation`就是在nix的基础上加了些参数，使得定义更加方便和直观，没有太多的trick。所以直接理解nix的drv就行。

nix的文档中有提及`outputHash`这个参数。由于没有去查看nix的源代码，所以这里仅是猜想。当这个参数提供的时候，以这个参数做为drv的hash，否则计算所有的参数，由这些参数来计算hash。而这样一来，当我们在一个drv里使用了nixpkgs的fetcher时，这个fetcher的drv就做为了其计算值，而这个drv又由其``outputHash``来生成drv（理由见下方drv格式的说明），而不需要在计算hash时去下载文件。因此，我们可以在仅当使用这个drv时，才会去下载我们需要的文件。但使用buildin的fetcher时，由于最外层的drv，即我们所用的包是不显式定义`outputHash`的（这样也会比较方便，因为只要我们改动了一点，hash就自动变了，而不需要去人工担心。可以这样的原因是由于drv的文件格式，其hash计算是基于这一文件进行计算的。），所以需要计算hash，而计算hash时就需要每个参数进行展开了，当然这里用的buildin的fetcher就得执行了。

上述的过程中有个关键就是drv的build，如果build drv的时候，还是需要所有的参数，那么nixpkgs的fetcher也会和builtin的一样，需要拉取文件了。所以关键就在于drv构建的时候，只需要其所有必要的信息，即这个drv生成后的hash和这个drv包含的指令。虽然打开一个drv文件，会发现其实是一个纯文本，其格式定义于[nix源代码中](https://github.com/NixOS/nix/blob/master/src/libstore/derivations.cc)。可以看出，这个文件就是把所有的drv转换成了其对应安装后的目录。所以nixpkgs的fetcher生成的drv也会变成其安装后的目录，而获取这个目录，我们需要的仅仅只有hash和包名，最多加上其对应的drv。由于drv内只需要目录和脚本信息，所以nixpkgs的fetcher的drv生成时，由hash得到目录，而内部信息通过url和脚本进行lazy，也就不需要有下载这个过程参与了（下载的行为定义于build脚本中，而脚本使用了drv定义的变量来传递下载的地址等信息，因此达到了构建drv不需要下载，而安装时进行下载的行为）。这样计算外层drv的hash时需要的fetcher得到的信息就不需要下载后才可计算了。
