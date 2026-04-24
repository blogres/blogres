---
icon: linux
title: VMware安装Linux系统
category: 
- Linux
date: 2022-09-12
tag:
- VMware
---

使用VMware安装Linux系统，并配置centos的k8s模板环境

<!-- more -->

## 新建虚拟机

文件—新建虚拟机—选择典型—稍后安装操作系统—linux—版本centos 7 64—划分20G模拟磁盘大小，虚拟磁盘拆分多个文件—点击完成：

![](./vmware-install-linux.assets/true-image-20220912192114470.png)

![](./vmware-install-linux.assets/true-image-20220912414459356.png)

![](./vmware-install-linux.assets/true-image-20220912414596909.png)

![](./vmware-install-linux.assets/true-image-202209124146699712.png)

![](./vmware-install-linux.assets/true-image-202209124147320915.png)

然后点击下一步、点击完成：

![](./vmware-install-linux.assets/true-image-202209124148861518.png)


## 配置系统

点击系统centos，右键，选择设置，内存设置1G以上，点击cd/dvd设备选择iso映像文件

![ ](./vmware-install-linux.assets/true-image-202209124149986021.png)

或：

![](./vmware-install-linux.assets/true-image-202209124150927624.png)

![](./vmware-install-linux.assets/true-image-202209124152150227.png)


## 开始安装虚拟机

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


登录：输入用户名与密码

![](./vmware-install-linux.assets/true-image-202209124172424572.png)


## 配置 centos7.9 模板

步骤

1. 查看当前系统版本
2. 设置sudo权限
3. 国内yum源
4. 升级内核
5. 关闭防火墙firewalld、关闭selinux
6. 配置网卡
7. 重新生成GRUB配置并更新内核参数


### 1、查看当前系统版本

`cat /etc/redhat-release`

```shell
CentOS Linux release 7.9.2009 (Core)
```

### 2、普通用户设置sudo权限

1、su root

2、chmod u+w /etc/sudoers

3、vim /etc/sudoers

> root	ALL=(ALL)	ALL
>
> a	ALL=(ALL)	ALL

4、撤销sudoers文件写权限，命令：

> chmod u-w /etc/sudoers

5、切换用户

> su a

### 3、配置国内yum源

[具体内容跳转](./yum-repo.md)

### 4、升级内核、并删除当前无用的系统内核版本

[具体内容跳转](./update-kernel.md)

### 5、关闭防火墙firewalld、关闭selinux、关闭swap、确保不休眠

```shell
# 1、 关闭防火墙
## centos
systemctl start firewalld | stop | enable | disable | status
## ubuntu
systemctl disable ufw.service && systemctl stop ufw.service
ufw start | enable | stop | disable | status

# 2、 关闭selinux
setenforce 0 # 临时关闭 
# 永久关闭/etc/selinux/semanage.conf
sed -i 's/enforcing/disabled/' /etc/selinux/config
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
# 查看SELinux的状态
getenforce

# 3、关闭 swap
swapoff -a  #临时关闭
#永久关闭
sed -ri 's/.*swap.*/#&/' /etc/fstab

# 4、确保不休眠
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

### 6、配置网卡

[具体内容跳转](./networkcentos.md)

`/etc/hosts`

```shell
cat <<EOF | tee /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2
192.168.0.133 node3
EOF
```


### 7、禁用 GRUB 规则

在 grub 文件里面的 `GRUB_CMDLINE_LINUX` 变量添加 `net.ifnames=0` `biosdevname=0`

**原来配置的网卡ip会生效：/etc/sysconfig/network-scripts/ifcfg-ens33**，所以我不需要这里

```shell
[root@localhost ~]# cat /etc/default/grub
...
GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet"
# 换为：
GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet net.ifnames=0 biosdevname=0"
```

重新生成GRUB配置并更新内核参数

```shell
[root@localhost ~]# grub2-mkconfig -o /boot/grub2/grub.cfg
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-3.10.0-327.el7.x86_64
Found initrd image: /boot/initramfs-3.10.0-327.el7.x86_64.img
。。。。
```
