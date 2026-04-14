---
icon: linux
title: Centos与Ubuntu常见命令区别
category: 
- Linux
date: 2022-11-09
#收藏
star: true
tag:
- linux
---

记录Centos7与Ubuntu常见命令区别

<!-- more -->

## 包管理工具差异

- Ubuntu主要配置文件位于 `/etc/apt/` 目录下。
- CentOS主要配置文件位于 `/etc/yum.repos.d/` 目录下。

| 操作           | Ubuntu/Debian (apt/apt-get)   | CentOS/RHEL (yum/dnf)         |
| -------------- | :---------------------------- | :---------------------------- |
| 更新软件包列表 | sudo apt ==update==           | sudo yum ==check-update==     |
| 安装软件包     | sudo apt install package_name | sudo yum install package_name |
| 移除软件包     | sudo apt remove package_name  | sudo yum remove package_name  |
| 搜索软件包     | apt search keyword            | yum search keyword            |
| 查看软件包信息 | apt ==show== package_name     | yum ==info== package_name     |
| 升级所有软件包 | sudo apt ==upgrade==          | sudo yum ==update==           |
| 清理缓存       | sudo apt ==clean==            | sudo yum ==clean all==        |


## 服务管理差异

- Ubuntu 较新版本使用`systemd`，命令为`systemctl`；旧版本可能使用`service`命令。
- CentOS7+使用`systemd`；CentOS 6及更早版本使用`service`和`chkconfig`。

| 操作         | Ubuntu (systemd)               | CentOS (systemd)               |
| ------------ | ------------------------------ | ------------------------------ |
| 启动服务     | sudo systemctl start service   | sudo systemctl start service   |
| 停止服务     | sudo systemctl stop service    | sudo systemctl stop service    |
| 重启服务     | sudo systemctl restart service | sudo systemctl restart service |
| 查看服务状态 | systemctl status service       | systemctl status service       |
| 启用开机启动 | systemctl enable service       | systemctl enable service       |
| 禁用开机启动 | systemctl disable service      | systemctl disable service      |


## 网络配置差异

- Ubuntu网络配置文件通常位于`/etc/netplan/`(新版本)或`/etc/network/interfaces`(旧版本)。
- CentOS网络配置文件通常位于`/etc/sysconfig/network-scripts/ifcfg-*`。
- 主机名配置`/etc/hostname`，`/etc/sysconfig/network(CentOS 6)`。

| 操作         | Ubuntu                        | CentOS                                                       |
| ------------ | ----------------------------- | ------------------------------------------------------------ |
| 重启网络服务 | `sudo netplan apply` (新版本) | `sudo systemctl restart network` 或 `sudo /etc/init.d/networking restart` |
| 查看IP地址   | ip a 或 ifconfig              | ip a 或 ifconfig                                             |
| 查看路由表   | ip route                      | ip route 或 ==route -n==                                     |

## 用户和权限管理

- Ubuntu默认情况下，安装时创建的第一个用户具有sudo权限；sudo配置文件：`/etc/sudoers`
- CentOS默认情况下，root用户是唯一具有完全权限的账户；将用户添加到`wheel`组并配置`sudo`

| 操作         | Ubuntu                              | CentOS                    |
| ------------ | ----------------------------------- | ------------------------- |
| 添加用户     | sudo ==adduser== username           | sudo ==useradd== username |
| 设置密码     | sudo passwd username                | sudo passwd username      |
| 添加用户到组 | sudo usermod -aG groupname username | 同上                      |
| 删除用户     | sudo ==deluser== username           | sudo ==userdel== username |

## 防火墙配置

- Ubuntu默认使用`ufw`(Uncomplicated Firewall)；底层使用`iptables`/`nftables`
- CentOS 7使用`firewalld`；CentOS 6使用`iptables`

| 操作       | Ubuntu (ufw)        | CentOS (firewalld)                                     |
| ---------- | ------------------- | ------------------------------------------------------ |
| 启用防火墙 | sudo ufw enable     | sudo systemctl start firewalld                         |
| 禁用防火墙 | sudo ufw disable    | sudo systemctl stop firewalld                          |
| 允许端口   | sudo ufw allow port | `sudo firewall-cmd --add-port=port/tcp --permanent`    |
| 拒绝端口   | sudo ufw deny port  | `sudo firewall-cmd --remove-port=port/tcp --permanent` |
| 查看规则   | sudo ufw status     | sudo firewall-cmd --list-all                           |
| 重载配置   | sudo ufw reload     | sudo firewall-cmd --reload                             |


## 日志管理

- Ubuntu默认`rsyslog`；查看系统日志：`journalctl`(systemd)或查看`/var/log/syslog`
- CentOS默认使用`rsyslog`(CentOS 6/7)或`journald`(CentOS 7+)；查看系统日志：`journalctl`或查看`/var/log/messages`

| 操作         | Ubuntu                              | CentOS                                |
| ------------ | ----------------------------------- | ------------------------------------- |
| 查看系统日志 | `journalctl 或 cat /var/log/syslog` | `journalctl 或 cat /var/log/messages` |
| 跟踪日志     | `tail -f /var/log/syslog`           | `tail -f /var/log/messages`           |
| 日志轮转配置 | `/etc/logrotate.conf`               | `/etc/logrotate.conf`                 |


## 其他实用差异

### 系统信息查看

| 操作         | Ubuntu           | CentOS                    |
| ------------ | ---------------- | ------------------------- |
| 查看系统版本 | `lsb_release -a` | `cat /etc/redhat-release` |
| 查看内核版本 | `uname -r`       | `uname -r`                |
| 查看磁盘空间 | `df -h`          | `df -h`                   |
| 查看内存使用 | `free -h`        | `free -h`                 |


### 软件包名称差异

| 软件         | Ubuntu包名   | CentOS包名     |
| ------------ | :----------- | -------------- |
| Apache       | apache2      | httpd          |
| PHP          | php          | php            |
| MySQL Server | mysql-server | mariadb-server |
| Python 3     | python3      | python3        |
| Vim          | vim          | vim-enhanced   |































