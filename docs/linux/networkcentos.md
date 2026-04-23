---
icon: linux
title: 网络配置Centos-Rocky
category: 
- Linux
- Centos
- Rocky
date: 2021-09-10
tag:
- network
---

网络配置 Centos和Rocky

<!-- more -->

## 设置本机静态IP

### 查看本机ip

`ifconfig`、`ip a`

### 配置文件

::: tabs#a

@tab CentOS#CentOS

```shell
/etc/sysconfig/network-scripts/ifcfg-ens33
```

@tab Rocky#Rocky

```shell
/etc/NetworkManager/system-connections/ens160.nmconnection
```

:::

具体内容

::: tabs#a

@tab CentOS

**BOOTPROTO**说明：

- **dhcp**：表示使用动态IP，动态IP地址是自行生成。
- **none**：无（不指定）通常是DHCP。
- **static**：要自己自行指定IP地址，GATEWAY需要和虚拟机的网关地址一样。

```yaml :collapsed-lines=4
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
IPADDR="192.168.0.128"
# PREFIX="24"
NETMASK="255.255.255.0"
GATEWAY="192.168.0.1"
DNS1="192.168.0.1"
DNS2="8.8.8.8"
```

@tab Rocky


```yaml :collapsed-lines=10
[connection]
id=ens160
uuid=c08c9be8-986d-3529-97b4-efaf11d531c7
type=ethernet
autoconnect-priority=-999
interface-name=ens160
timestamp=1775383411

[ethernet]

[ipv4]
address1=192.168.0.128/24,192.168.0.2
dns=8.8.8.8
method=manual

[ipv6]
addr-gen-mode=eui64
method=auto

[proxy]

```

:::


- **生产 UUID**： `uuidgen ens33`
- **查看 UUID**： `nmcli con | sed -n '1,2p'`
- **查看分区uuid：**：`ls -l /dev/disk/by-uuid`


### 重新启动网络服务

::: tabs#a

@tab CentOS

```bash
systemctl network start | stop | start | status | restart
```

@tab Rocky


```bash
systemctl restart NetworkManager
或者
nmcli connection reload
nmcli connection down ens160 && nmcli connection up ens160
```

:::

### 查看DNS配置

`/etc/resolv.conf`

```bash
nameserver 8.8.8.8
```

### ping外网

```shell
ping -c 3 baidu.com
语法:
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
192.168.0.130 yu
```
