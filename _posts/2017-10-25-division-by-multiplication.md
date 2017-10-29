---
title: 用乘法实现除法
date: 2017-10-25 12:56:08 +0800
categories: algorithms
tags: structure
---

为什么我们需要用乘法来实现除法？首先在计算机运算中，乘法的效率要来得高于除法。其次，除法的实现在电路中非常不容易，而用乘法能实现在一定精度下的除法。

## 证明
downloads:
[pdf]({{ site.url }}/static/images/2017-10-25/testify.pdf)
[tex]({{ site.url }}/static/sources/2017-10-25/testify.tex)

假设 $$ Q = \frac{N}{D} $$，则：

$$
\begin{align*}
    Z &= 1 - D \\
    Q &= \frac{N}{D} = \frac{N(1+Z)}{D(1+Z)} \\
    &= \frac{N(1+Z)}{(1-Z)(1+Z)} \\
    &= \frac{N(1+Z)}{1-Z^2}
\end{align*}
$$

用$$ K = 1+Z^2 $$重复这个过程

$$
\begin{align*}
    Q &= \frac{N(1+Z)}{1-Z^2} \cdot \frac{1+Z^2}{1+Z^2} \\
    &= \frac{N(1+Z)(1+Z^2)}{1-Z^4} \\
\end{align*}
$$

重复N次

$$
\begin{align*}
    & Q = \frac{N}{D} = \frac{N(1+Z)(1+Z^2)(1+Z^3)\dots (1+Z^{2n-1})}{1-Z^{2n-1}} \\
    & \because Z < 1 \Rightarrow  \lim_{N\to 0}Z^{2n-1}=0 \\
    & \therefore Q = N(1+Z)(1+Z^2)(1+Z^3)\dots (1+Z^{2n-1})
\end{align*}
$$

对于8位精度，只需要$$ n = 3 $$即可，而$$ n = 5 $$则有32位精度。

## 完
就是这样。


