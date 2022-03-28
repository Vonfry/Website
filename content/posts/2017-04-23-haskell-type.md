---
categories:
- develop
date: "2017-04-23T13:06:18Z"
tags: 
- haskell
- type-annotation
title: Haskell类型限制
---

# 起因
起因其实是关于`catch`以及`catchIOError`。对于catch，一开始，博主怎么弄都是错误信息，最后的原因是在于lambda中第一个参数的类型是非确认而引起的。
<!--more-->

catch和catchIOError的原型：
```haskell
catch   :: Exception e
        => IO a         -- ^ The computation to run
        -> (e -> IO a)  -- ^ Handler to invoke if an exception is raised
        -> IO a
catch act = catchException (lazy act)

catchIOError :: IO a -> (IOError -> IO a) -> IO a
catchIOError = catch
```
官方文档中对于catch的用法给了一个例子
```haskell
catch (readFile f)
        (\e -> do let err = show (e :: IOException)
                  hPutStr stderr ("Warning: Couldn't open " ++ f ++ ": " ++ err)
                  return "")
```

【想通问题之前的博主言】这样一来，问题就出现了，为什么官方的例子中没有限制e的类型，确可以实现呢？

# 分析
从最根本一点点来思考吧。

## 类型类
类型类能推断约束而去执行对应的方法（不要想成C++的多态）。那么判断相应方法的方式，就是参数了。

## 单子/应用函子/函子
在单子中，有一个很重要的方法，即：`return`，而`return`和`pure`其实是同一个函数（基实这点不重要）。

来想一下吧。return是如何返回我们所需要的类型的？因为他的原型可是`return :: a -> m a`啊！不可能是用参数来判断的对吧！对吧！

然后仔细观察一下，这个的返回值，和函数声明或者说所写的`do`语法区内的返回值有关。也就是说这里的限定是由函数类型来做到的。

那么问题又来了。。为什么do语法区每行的基元单子是不同类型，最后返回的确是外层函数的包装？比如：
```haskell
main :: IO ()
main = do
    zero <- Just 0
    return ()
```
~~最后返回的可是`IO ()`哦！嗯。其实这个比较好理解，大部分教程上应该也写了，只是一开始没有想到就是了。其实在较新的GHC中，对do做了层叠。这个其实相当是两层do语法，换到单子的操作其实就是第一行的语法是在一个任意匹配参数的lambda里罢了。然后这个特别的语法把这一层给隐藏掉，就成了这个样子。所以说，do语法虽然易读，但是读懂还是有点麻烦呢……~~

嗯。这个不是正确的。是不可以的……博主理解错误了……

## lambda
想通了这些，我们再加到lambda，也就是一开始说的起因。嗯……好像什么都没有解决啊！！

呃，确实是这样，因为这里的问题和上面两点没有关系……单纯是思考时附加想到的问题。

首先，我们不要尝试去写一下`func :: a -> (b -> a) -> a`这样的函数，因为……博主发现，好象不是很好写出来。因为对于第二个参数中的b，不能写死，不然编译器出错。只能用某种方式来外部取得，呃？可是一个函数的参数固定时，返回值也是定值吧！！也就是说参数也是可变的……呃……好象不太好写测试用例，算了，先放弃吧。

我们来看看原型。。`catch act = catchException (lazy act)`，嗯，调用了另外一个函数，然而……嗯？啊？这个函数，我好象查不到定义啊！！结论：这是编译器实现的黑魔法……仅仅在这个内部，用某种方式生成了变化的返回类型。嗯……就先这样想好了。

然后……我们再一次回到了原点……为什么！！官方的样例代码能确认类型啊！！我们看一下文档说明。。
> Note that we have to give a type signature to e, or the program will not typecheck as the type is ambiguous. While it is possible to catch exceptions of any type, see the section "Catching all exceptions" (in Control.Exception) for an explanation of the problems with doing so.

嗯， 再仔细看一下，嗯？类型声名？哪里？嗯？这里？`let err = show (e :: IOException)`

嗯？函数体里？

我们来试一下，`a = \e -> print (e :: Int)`，最后的类型是，居然是！`a :: Int -> IO ()`。

如果，我们在绑定一个函数时，先写函数体，再写类型的话。。一样成立！！

也就是说，类型annotation是单独的语法……像是声名一样的存在，并不是一定要放在实现前的！！只要有一处，就等于是限制这个绑定（当然得在生命周期内）

### 另外一种注释
在思考的过程中，上stackoverflow也问了一下，然后得到了这样一个比较少见的语法，

`(catch :: IO a -> (IOError -> IO a) -> IO a) (readFile "test") (\_ -> return "")`

嗯。嗯。嗯……果然小众语言的书上面，写的东西就是不全面啊。很多都没有提到。

# 结论
## 类型确认方式
当调用时，依照参数

当返回时，依照参数，以及外层声名

## 类型注释
生命周期内，或者说是访问域内，任何地方的注释都是成立的！





