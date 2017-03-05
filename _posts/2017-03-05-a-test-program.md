---
title: 记一次作业程序
date: 2017-03-05 12:48:00 +0800
categories: code
tags: test python3
---

# 题目

> Description
> Frog have a very simple problem for you. Given two integers A and B, you are required to calculate the Result of A + B.
> Input
> The first line of the input contains an integer T(1≤T≤20) which means the number of test cases. Then T lines follow, each line consists of a complete formula, A+B=. The length of each integer will not exceed 10000 and B must be positive.
>
> Output
> For each test case, you should output two lines. The first line is "Case #:", # means the number of the test case. The second line is an equation "A + B = Sum", Sum means the result of A + B.
>
> Sample input
> 2
> 1+1=
> 2345+7890=
> Sample output
> Case 1:
> 1 + 1 = 2
> Case 2:
> 2345 + 7890 = 10235

# 解答

这个题目没有难度，用Py是非常轻松的，不用考虑大数问题。但是博主一开始提交时反复出现错误。

原因呢？

博主对于符号的判断，使用的是移出输入元素的最后一个字符（等号），但是其实不是，测试程序，在这个过程中可能在等号后面还有其它的输入，比如空格（测试过程是黑盒，笔者无奈。）。这种情况下，是要通过判断等号来截取的。

# 结论

最后这事给出一个结论，普遍性。所有的程序不论场景如何，考虑的情况必需充足，那么，这时就应该写出更为一般的解。而不是针对特殊情况来进行处理。