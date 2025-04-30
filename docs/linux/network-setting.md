---
icon: linux
title: Centos网络网卡配置
category: 
- Linux
# headerDepth: 5
date: 2021-09-10
tag:
- Linux
- network
---

Centos网络网卡配置

<!-- more -->

<https://blog.csdn.net/qq_42476834/article/details/106033034>

## 一、设置本机静态IP

### 查看本机ip：ifconfig

### 设置静态ip -> 配置文件

```shell
#网卡的目录:
##centOS7的网卡
vim /etc/sysconfig/network-scripts/ifcfg-ens33
##centOS6的网卡
vim /etc/sysconfig/network-scripts/ifcfg-eth0
```

**生产 UUID**： `uuidgen ens33`

`ls -l /dev/disk/by-uuid`

**查看 UUID**： `nmcli con | sed -n '1,2p'`

**BOOTPROTO**说明：

- **dhcp**：表示使用动态IP，动态IP地址是自行生成。
- **none**：无（不指定）通常是DHCP。
- **static**：要自己自行指定IP地址，GATEWAY需要和虚拟机的网关地址一样。

```shell
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_PRIVACY="no"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="ccb173d2-9470-4fc3-b894-cce7029f0455"
DEVICE="ens33"
ONBOOT="yes"
IPADDR="192.168.100.129"
# PREFIX="24"
NETMASK="255.255.255.0"
GATEWAY="192.168.100.2"
DNS1="192.168.100.2"
DNS2="8.8.8.8"
DNS3="192.168.1.1"
```

### 设置网关

`vim /etc/resolv.conf`

```shell
nameserver 192.168.100.2
nameserver 8.8.8.8
```

### 重新启动网络服务

```shell
system network start  //启动网络服务
service network stop   //停止网络服务
service network start  //启动网络服务
service network status   //查看网络服务状态
service network restart  //重启网络服务
systemctl restart network.service   //重启网络服务，
```

**system与systemctl的区别：**
  system：centos6之前使用
  systemctl：centos7之后出现的，centos7也可以使用system，兼容低版本

### ping：ctrl+z 退出

```shell
ping 语法
-c  # 设定ping的次数，如果没有设定默认会一直ping下去直到按 Ctrl + C 结束
-f  # 洪水ping，也就是以最快的速度去ping，可以用来测试丢包率
-i  # 设定ping的时间间隔，如 ping -i 0.5 www.baidu.com 表示每隔0.5秒ping一次，如果没有设置默认是一秒一次
-s  # 设置发送的数据包的大小，默认发送56字节，最大只能设置为65507字节
```

### 配置 vim /etc/hosts 映射关系

```shell
//添加ip+主机名
127.0.0.1  localhost localhost.localdomain localhost4 localhost4.localdomain4
::1     localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.100.130 yu
```


## 二、wind映射Linux主机

`C:\Windows\System32\drivers\etc`

```shell
192.168.100.130 yu.com
192.168.100.131 yu2.com
```
