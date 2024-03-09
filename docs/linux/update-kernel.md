---
icon: linux
title: Centos(kernel)内核升级
category: 
- Linux
headerDepth: 5
date: 2021-08-14
tag:
- Linux
- kernel
- centos7
---

Centos(kernel)内核升级

<!-- more -->


## 内核版本列表

[内核版本列表kernel.org](https://kernel.org/)


| 状态        | 版本              | 日期       | tarball                                                      | pgp                                                          | patch                                                        | inc.patch                                                    | view diff                                                    | browse                                                       | changelog                                                    |
| ----------- | ----------------- | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| mainline:   | **6.8-rc7**       | 2024-03-03 | [tarball](https://git.kernel.org/torvalds/t/linux-6.8-rc7.tar.gz) |                                                              | [patch](https://git.kernel.org/torvalds/p/v6.8-rc7/v6.7)   | [inc. patch](https://git.kernel.org/torvalds/p/v6.8-rc7/v6.8-rc6) | [view diff](https://git.kernel.org/torvalds/ds/v6.8-rc7/v6.8-rc6) | [browse](https://git.kernel.org/torvalds/h/v6.8-rc7)       |                                                              |
| stable:     | **6.7.9**         | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.7.9.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.7.9.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/patch-6.7.9.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/incr/patch-6.7.8-9.xz) | [view diff](https://git.kernel.org/stable/ds/v6.7.9/v6.7.8) | [browse](https://git.kernel.org/stable/h/v6.7.9)           | [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.7.9) |
| longterm:   | **6.6.21**        | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.6.21.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.6.21.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/patch-6.6.21.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/incr/patch-6.6.20-21.xz) | [view diff](https://git.kernel.org/stable/ds/v6.6.21/v6.6.20) | [browse](https://git.kernel.org/stable/h/v6.6.21)          | [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.6.21) |
| longterm:   | **6.1.81**        | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.81.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.81.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/patch-6.1.81.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v6.x/incr/patch-6.1.80-81.xz) | [view diff](https://git.kernel.org/stable/ds/v6.1.81/v6.1.80) | [browse](https://git.kernel.org/stable/h/v6.1.81)          | [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.1.81) |
| longterm:   | **5.15.151**      | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.151.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.151.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/patch-5.15.151.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/incr/patch-5.15.150-151.xz) | [view diff](https://git.kernel.org/stable/ds/v5.15.151/v5.15.150) | [browse](https://git.kernel.org/stable/h/v5.15.151)        | [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.15.151) |
| longterm:   | **5.10.212**      | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.10.212.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.10.212.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/patch-5.10.212.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/incr/patch-5.10.211-212.xz) | [view diff](https://git.kernel.org/stable/ds/v5.10.212/v5.10.211) | [browse](https://git.kernel.org/stable/h/v5.10.212)        | [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.10.212) |
| longterm:   | **5.4.271**       | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.4.271.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.4.271.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/patch-5.4.271.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v5.x/incr/patch-5.4.270-271.xz) | [view diff](https://git.kernel.org/stable/ds/v5.4.271/v5.4.270) | [browse](https://git.kernel.org/stable/h/v5.4.271)         | [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.4.271) |
| longterm:   | **4.19.309**      | 2024-03-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v4.x/linux-4.19.309.tar.xz) | [pgp](https://cdn.kernel.org/pub/linux/kernel/v4.x/linux-4.19.309.tar.sign) | [patch](https://cdn.kernel.org/pub/linux/kernel/v4.x/patch-4.19.309.xz) | [inc. patch](https://cdn.kernel.org/pub/linux/kernel/v4.x/incr/patch-4.19.308-309.xz) | [view diff](https://git.kernel.org/stable/ds/v4.19.309/v4.19.308) | [browse](https://git.kernel.org/stable/h/v4.19.309)        | [changelog](https://cdn.kernel.org/pub/linux/kernel/v4.x/ChangeLog-4.19.309) |
| linux-next: | **next-20240307** | 2024-03-07 |                                                              |                                                              |                                                              |                                                              |                                                              | [browse](https://git.kernel.org/next/linux-next/h/next-20240307) |                                                              |

- longterm：长期支持版本
- stable：稳定版本
- mainline：主线版本

## 导入该源的秘钥

[http://www.elrepo.org/](http://www.elrepo.org/)

```shell
# 1、导入该源的秘钥
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
# 2、启用该源仓库
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-6.el7.elrepo.noarch.rpm
或者：
yum -y install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

## 查看可升级的内核版本

```shell
yum --disablerepo="*" --enablerepo="elrepo-kernel" list available
```

## 可安装的软件包

kernel-lt(基于长期支持分支)   5.4.271-1.el7.elrepo

kernel-ml(主流的，来源于主线稳定分支提供)   5.4.271-1.el7.elrepo

## 安装内核

```shell
yum --enablerepo=elrepo-kernel install -y kernel-lt-5.4.211-1.el7.elrepo
```

## 查看当前系统内可用内核

```shell
awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
```

## 设置开机从新内核版本启动

**其中 0 是上面查询出来的可用内核编号**

```shell
grub2-set-default 0 && reboot
```

## 删除当前无用的系统内核版本

### 查看所有已安装的内核版本

```shell
[root@init ~]# rpm -qa | grep kernel

kernel-tools-libs-3.10.0-1160.76.1.el7.x86_64
kernel-3.10.0-1160.76.1.el7.x86_64
kernel-headers-3.10.0-1160.76.1.el7.x86_64
kernel-devel-3.10.0-1160.el7.x86_64
kernel-tools-3.10.0-1160.76.1.el7.x86_64
kernel-devel-3.10.0-1160.76.1.el7.x86_64
kernel-lt-5.4.271-1.el7.elrepo.x86_64
kernel-3.10.0-1160.el7.x86_64
abrt-addon-kerneloops-2.1.11-60.el7.centos.x86_64
```

### 当前使用的内核版本

```shell
[root@init ~]# uname -r
5.4.271-1.el7.elrepo.x86_64
```

### 删除

```shell
yum remove -y kernel-3.10.0-1160.el7.x86_64 kernel-3.10.0-1160.76.1.el7.x86_64
```

或

```shell
yum remove $(rpm -qa | grep kernel | grep -v $(uname -r))

# 全部卸载后重新安装
[root@init ~]# yum --enablerepo=elrepo-kernel install -y kernel-lt-5.4.271-1.el7.elrepo \
kernel-lt-doc-5.4.271-1.el7.elrepo \
kernel-lt-headers-5.4.271-1.el7.elrepo \
kernel-lt-tools-5.4.271-1.el7.elrepo \
kernel-lt-tools-libs-5.4.271-1.el7.elrepo \
kernel-lt-tools-libs-devel-5.4.271-1.el7.elrepo \
kernel-lt-devel-5.4.271-1.el7.elrepo

[root@init ~]# rpm -qa | grep kernel
kernel-lt-5.4.271-1.el7.elrepo.x86_64
kernel-lt-doc-5.4.271-1.el7.elrepo.noarch
kernel-lt-tools-5.4.271-1.el7.elrepo.x86_64
kernel-lt-tools-libs-5.4.271-1.el7.elrepo.x86_64
kernel-lt-tools-libs-devel-5.4.271-1.el7.elrepo.x86_64
kernel-lt-headers-5.4.271-1.el7.elrepo.x86_64
abrt-addon-kerneloops-2.1.11-60.el7.centos.x86_64
kernel-lt-devel-5.4.271-1.el7.elrepo.x86_64
```

## 安装其他工具

```shell
yum install -y gcc make ncurses-devel openssl-devel flex bison  elfutils-libelf-devel
```
