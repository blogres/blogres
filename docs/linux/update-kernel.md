---
icon: linux
title: Centos(kernel)内核升级
category: 
- Linux
# headerDepth: 5
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


| 状态       | 版本              | 日期       | changelog                                                    |
| ---------- | ----------------- | ---------- | ------------------------------------------------------------ |
| mainline:  | **6.19-rc1**      | 2025-12-14 |                                                              |
| stable:    | **6.18.2**        | 2025-12-18 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.18.2.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.18.2) |
| stable:    | **6.17.13 [EOL]** | 2025-12-18 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.17.13.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.17.13) |
| longterm:  | **6.12.63**       | 2025-12-18 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.12.63.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.12.63) |
| longterm:  | **6.6.119**       | 2025-12-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.6.119.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-6.6.119) |
| longterm:  | **6.1.159**       | 2025-12-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.159.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-6.1.159) |
| longterm:  | **5.15.197**      | 2025-12-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-5.15.197.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.15.197) |
| longterm:  | **5.10.247**      | 2025-12-06 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-5.10.247.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.10.247) |
| longterm   | 5.4.302 **[EOL]** | 2025-12-03 | [tarball](https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-5.4.302.tar.xz) [changelog](https://cdn.kernel.org/pub/linux/kernel/v5.x/ChangeLog-5.4.302) |
| linux-next | **next-20251219** | 2025-12-19 |                                                              |

- longterm：长期支持版本
- stable：稳定版本
- mainline：主线版本

## 导入该源的秘钥

[http://www.elrepo.org/](http://www.elrepo.org/)

```shell
# 1、导入该源的秘钥
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
# 2、启用该源仓库
rpm -Uvh https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
或者：
yum -y install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

## 查看可升级的内核版本

```shell
yum --disablerepo="*" --enablerepo="elrepo-kernel" list available
```

## 可安装的软件包

kernel-lt(基于长期支持分支)   6.6.119-1.el7.elrepo

kernel-ml(主流的，来源于主线稳定分支提供)   6.6.119-1.el7.elrepo

## 安装内核

```shell
yum --enablerepo=elrepo-kernel install -y kernel-lt-6.6.119-1.el7.elrepo
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
