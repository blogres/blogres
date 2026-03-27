---
icon: linux
title: VMware安装Linux系统
category: 
- Linux
date: 2022-09-12
tag:
- VMware
---

使用VMware安装Linux系统

<!-- more -->

## 步骤一、新建虚拟机

文件—新建虚拟机—选择典型—稍后安装操作系统—linux—版本centos 7 64—划分20G模拟磁盘大小，虚拟磁盘拆分多个文件—点击完成：

![](./vmware-install-linux.assets/true-image-20220912192114470.png)

![](./vmware-install-linux.assets/true-image-20220912414459356.png)

![](./vmware-install-linux.assets/true-image-20220912414596909.png)

![](./vmware-install-linux.assets/true-image-202209124146699712.png)

![](./vmware-install-linux.assets/true-image-202209124147320915.png)

然后点击下一步、点击完成：

![](./vmware-install-linux.assets/true-image-202209124148861518.png)


## 步骤二、配置系统

点击系统centos，右键，选择设置，内存设置1G以上，点击cd/dvd设备选择iso映像文件

![ ](./vmware-install-linux.assets/true-image-202209124149986021.png)

或：

![](./vmware-install-linux.assets/true-image-202209124150927624.png)

![](./vmware-install-linux.assets/true-image-202209124152150227.png)


## 步骤三、开始安装虚拟机

ctrl+alt键显示鼠标

![](./vmware-install-linux.assets/true-image-202209124153178630.png)


### 选择安装语言

![](./vmware-install-linux.assets/true-image-202209124153886433.png)


### 选择软件类型

![](./vmware-install-linux.assets/true-image-202209124155289736.png)


### 分区设置

```txt
linux一般来说分为4个基本区：
    启动分区：boot——保存系统启动的数据，一般100-200m；Rocky系统需大于512MIB
    交换分区：swap——理解为虚拟内存，真实内存不够的时候临时会使用swap分区，一般是内存的两倍，2G
    用户分区：home——保存用户信息
    根分区：/ 
```

![](./vmware-install-linux.assets/true-image-202209124162774239.png)

![](./vmware-install-linux.assets/true-image-202209124163579742.png)

![](./vmware-install-linux.assets/true-image-202209124164167145.png)

其他分区类似操作，完成分区结果如下：（最后添加 “/” 目录时不需要指定分区大小，直接点击 “添加挂载点”，系统会自动把当前分区的总空间剩余空间分配到 “/” 目录），最后点击完成按钮

![](./vmware-install-linux.assets/true-image-202209124164855848.png)

![](./vmware-install-linux.assets/true-image-202209124166340651.png)


### 设置网络主机名：（主机名默认是：localhost）

![](./vmware-install-linux.assets/true-image-202209124167487654.png)

![](./vmware-install-linux.assets/true-image-202209124168403157.png)


### 设置root用户密码

![](./vmware-install-linux.assets/true-image-202209124169254060.png)

![](./vmware-install-linux.assets/true-image-202209124170054863.png)


### 设置普通用户极密码

![](./vmware-install-linux.assets/true-image-202209124170845466.png)


### 最后等待安装

![](./vmware-install-linux.assets/true-image-202209124171530969.png)



### 登录：输入用户名与密码

![](./vmware-install-linux.assets/true-image-202209124172424572.png)

