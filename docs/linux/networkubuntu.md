---
icon: linux
title: 网络配置Ubuntu
category: 
- Ubuntu
- Linux
date: 2022-11-09
tag:
- network
---

网络配置Ubuntu

<!-- more -->


进入 Netplan 配置文件目录：

```bash
cd /etc/netplan/
```

编辑 `50-cloud-init.yaml`

```bash
sudo nano 50-cloud-init.yaml
```

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      addresses: [192.168.0.129/24]
      nameservers:
        addresses:
        - 192.168.0.2
        - 8.8.8.8
        search: []
      routes:
      - to: "default"
        via: "192.168.0.2"

```

`renderer` 配置为 `networkd`，使用 `systemd-networkd` 作为网络配置的后端。桌面环境使用 `NetworkManager`，`Ubuntu Server` 和无头环境使用 `networkd`。

> - **addresses** 是静态 IP 和子网掩码。
> - **nameservers.addresses** 是 DNS 服务器。
> - 保存并退出（nano 中按 Ctrl+O 保存，Ctrl+X 退出）

应用配置：

```bash
netplan apply
```

检查网络状态：

```bash
ip addr show
ip route show
systemd-resolve --status
ping -c 3 baidu.com
```
