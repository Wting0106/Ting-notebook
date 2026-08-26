# 3DGS的表示（1）

【部分摘录】[原文](https://yindaheng98.github.io/%E5%9B%BE%E5%BD%A2%E5%AD%A6/3DGaussianSplatting.html#splatting)

## 如何表示Gaussian？

---

### 1D→3D？

**1D高斯即正态分布：**

$N_{\mu ,\sigma}\left( x \right) =\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{\left( x-\mu \right) ^2}{2\sigma ^2}}$

其图像为一个单钟形对称曲线，均值$\mu$控制对称轴进而控制图形位置，标准差$\sigma$控制密度集中程度。对一段$x$区间进行积分可以得到分布中的数据落在这一区间的概率，其中绝大多数落在$\left[ \mu -3\sigma ,\mu +3\sigma \right]$（概率：0\.9974）。

从其形式可知，高斯分布只有两个参数$\mu,\sigma$，所以一组$\mu,\sigma$可以确定一个1D高斯分布函数，进而对应一条1D线段$\left[ \mu -3\sigma ,\mu +3\sigma \right]$，其位置决定于$\mu$、长度决定于$\sigma$，通过改变$\mu,\sigma$可以表达1D数轴上不同位置和长度的线段。

**3D高斯的正态分布：**

$N_{\mu _x,\sigma _x,\mu _y,\sigma _y,\mu _z,\sigma _z}\left( x,y,z \right) =\frac{1}{\sqrt{2\pi} ^3\sigma _x\sigma _y\sigma _z}\exp \left( -\frac{\left( x-\mu _x \right) ^2}{2{\sigma _x}^2}-\frac{\left( y-\mu _y \right) ^2}{2{\sigma _y}^2}-\frac{\left( z-\mu _z \right) ^2}{2{\sigma _z}^2} \right)$



这个形式其实是这三个变量为**互不相关****的独立变量**且**椭球的坐标系和世界坐标系平行**的情况。

**但在本文中的3D Gaussian点可以旋转**，所以它的对称轴（后文称为 **模型坐标系** ）不一定和世界坐标系重叠。

这源于协方差Cov

> 方差表示沿着某个方向的不确定性大小，方差大→这个方向拉得更长。
> 
> 方差：三个方向独立，不可以旋转，此时Cov=0
> 
> 协方差：三个方向相关，可以旋转。
> 
> 



3D Gaussian公式：

首先复习联合概率密度函数：

$p(x_1, \cdots, x_n) = \frac{1}{(2 \pi)^{\frac{n}{2}} \left| \Sigma \right|^{\frac{1}{2}}} \cdot e^{-\frac{1}{2} \cdot [(\vec{X} - \vec{\mu})^\top \Sigma^{-1}(\vec{X} - \vec{\mu})]}$

三维的情况，用$\bm x=[x,y,z]^T$表示三维空间中的坐标：

$p(\bm x) = \frac{1}{\sqrt{2\pi}^3\det(\Sigma)} \cdot e^{-\frac{1}{2}(\bm x - \bm\mu)^T \Sigma^{-1}(\bm x - \bm\mu)}$

此时协方差矩阵$\Sigma$为：

$\Sigma=
\left[ \begin{matrix} 
        \sigma _{x}^{2}&                \mathrm{Cov}\left( x,y \right)&                \mathrm{Cov}\left( x,z \right)\\
         \mathrm{Cov}\left( y,x \right)&                \sigma _{y}^{2}&                \mathrm{Cov}\left( y,z \right)\\
         \mathrm{Cov}\left( z,x \right)&                \mathrm{Cov}\left( z,y \right)&                \sigma _{z}^{2}\\
\end{matrix} \right]$

其中$\bm\mu$是椭球中心（控制世界空间位置平移），协方差矩阵$\Sigma$控制椭球在3轴向的伸缩和旋转（模型坐标系），协方差矩阵的特征向量就是椭球对称轴（即，特征向量代表椭球三个主轴方向）

> 注：在数学上每个高斯分布都覆盖整个空间，当它是椭球是因为它的等高线是椭球。计算的时候显然不能每个像素点上对每个高斯点都采个样，所以实际使用中会把距离中心较远的地方截掉（本文是在概率积分$99\%$的等高线截），截了就看着是一个中心透明度高周围透明度低的椭球。
> 
> 

论文中的定义方式：

$G\left(\bm x \right) =e^{-\frac{1}{2}\left(\bm x \right) ^T\Sigma ^{-1}\left(\bm x \right)}$

和标准形式对比可以看到：

- 默认模型坐标中心在坐标系原点，方便旋转放缩，放入世界坐标系时再加上平移

- 去掉了指数部分前面的归一化系数，所以在空间上的积分不为1，而是在$\bm x=[0,0,0]^T$处值等于1，所以是一个中间不透明（$G\left(\bm x \right)$值为1），越往四周越透明的椭球。

    - 论文中用一个不透明度值$\alpha$控制Gaussian点整体的透明度，可以让Gaussian点中间也透明



## 如何表示Gaussian颜色？

---

球谐函数SH：一组基函数

> 像泰勒展开、傅里叶展开中也是一组基函数构成的：
> 
> 比如泰勒展开以多项式函数系$\{1,x-x_0,(x-x_0)^2,(x-x_0)^3,\dots,y_{n}=(x-x_0)^n,\dots\}$为基函数，
> 
> 在对函数$f(x)$的泰勒展开中：
> 
> $\begin{aligned}
> f(x)&=\frac{f(x_0)}{0!}+\frac{f'(x_0)}{1!}(x-x_0)+\frac{f''(x_0)}{2!}(x-x_0)^2+\cdots+\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n+\cdots\\
> &=\sum_{n=0}^\infty\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n
> \end{aligned}$
> 
> $\{\frac{f(x_0)}{0!},\frac{f'(x_0)}{1!},\frac{f''(x_0)}{2!},\dots,\frac{f^{(n)}(x_0)}{n!},\dots\}$就是这组基函数的系数。
> 
> 有了基函数，就可以把任意一个函数，描述成几个基函数的加权和了。
> 
> 

这里用的是二维直角坐标系下的函数$y=f(x)$举例，而拓展到极坐标系函数$r=f(\theta)$也有多种基函数。

再扩展到三维坐标系下，函数$z=f(x,y)$表示一个平面，同样有二维傅里叶级数等二维基函数；而三维极坐标系即球面坐标系函数$r=f(\theta,\phi)$对应的则通常是一个凹凸不平的球面（半径$r$随方向角$(\theta,\phi)$变化且方向角范围为$[-\pi,\pi]$），也同理可以用一系列基函数近似表示，这些基函数称为“球面基函数”。

而球谐函数\(Spherical Harmonics\)就是最有名的球面基函数。球谐函数有很多很好的性质，比如正交性，旋转不变性，就和傅里叶级数里的基函数一样完美。



这里以原文作者举例的二维SH表示的各基函数，可以形象的看到越复杂的基函数可以表示的二维方向可以更多。

![二维球谐函数基函数](/Ting-notebook/3DGS/images/sh-2d.png)

三维基函数同理：

![三维球谐函数基函数](/Ting-notebook/3DGS/images/sh-3d.png)

用于记录空间中某个点从不同方向看过去的不同颜色，这在点云渲染中非常有用，3DGS就是用球谐函数记录空间中的Gaussian点在不同方向的颜色。

实际应用中的球谐函数基函数一般只用到二阶或三阶。 二阶是4个系数，拓展到rgb，每个颜色通道一个系数，就是4 \* 3 = 12个系数。 三阶是9个系数，拓展到rgb就是9 \* 3 = 27个系数。

为啥不用更高阶的SH？一方面是因为更多的系数会带来更大的存储压力、计算压力，而一般描述变化比较平滑的环境漫反射部分，用3阶SH就足够了；另一方面则是因为SH的物理含义不是特别好理解，高阶SH容易出现各种花式Artifact，美术同学一般都会认为这种表现属于bug。


