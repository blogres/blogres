---
icon: /icons/k8s/k8s_16x16.png
title: k8s实用脚本
category: 
- kubernetes
headerDepth: 5
date: 2020-04-20
order: 16
tag:
- Linux
- k8s
- script
---

k8s集群实用脚本，实现自动化安装部署

<!-- more -->

**注意**：请使用**GitBash**运行脚本。

## 根据CentOS7模板镜像自动创建集群系统auto-clone.sh

[CentOS7模板镜像地址](https://pan.baidu.com/s/1K84oi2qsF33WnNrgqbJ_NA)，提取码：`1234`

### 文件放置规范

```
E:\\k8s
|-- CentOS7		#CentOS7模板镜像，已经配置好内核版本、yum源等。
|------ CentOS7.vmx
|------ CentOS7.vmxf
|------ CentOS7.vmdk
|
|-- master		#auto_VM克隆CentOS7生成的master
|------ master.vmx
|------ master.vmxf
|------ master.vmdk
|
|-- node1		#auto_VM克隆CentOS7生成的node1
|------ node1.vmx
|------ node1.vmxf
|------ node1.vmdk
|
|-- node2: ...
|-- auto-clone.sh	#自动克隆系统脚本，与CentOS7模板镜像处于同一位置。
|-- kill.bat	#结束vmware进程
|-- CentOS7.7z	#打包CentOS7模板镜像，使用时需要解压
```

### auto-clone.sh

::: details 点击查看代码

```shell
#!/bin/bash

# 把first.sh脚本手动上传到CentOS7系统里的/root/first.sh，chmod -R 755 ./first.sh
# 在vmware手动批量克隆虚拟机-修改IP+hostname

host_master=(130)
host_node=(131 132)
gu="root"
gp="123456a"

#模板镜像位置，可自由修改
VMX_FILE="$(pwd)/CentOS7/CentOS7.vmx"
if [ ! -e ${VMX_FILE} ]; then
   echo ">>>>>>>>>> 没有模板镜像 <<<<<<<<<<"
fi

# vmrun.exe 位置
PATH_VMRUN_EXE_CMD="D:\\VMware\\vmrun.exe"
# 集群机器位置
K8S_CENTOS7_CMD="F:\\vm\\k8s"
#服务器名称
MASTER_NAME="master"
NODE_NAME="node"

# master 修改IP地址
set_ip_master(){
  for i in {0..1};
  do
    >  ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
    echo "${PATH_VMRUN_EXE_CMD} -T ws -gu ${gu} -gp ${gp} runProgramInGuest \"${K8S_CENTOS7_CMD}\\${MASTER_NAME}\\${MASTER_NAME}.vmx\" /bin/bash /root/first.sh 13${i} ${MASTER_NAME}" >>  ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
    echo "ping -n 6 192.168.100.13${i}" >> ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
	echo "exit" >> ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
  done

}

# node 修改IP地址
set_ip_node(){
  for i in {1..2};
  do
    >  ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
    echo "${PATH_VMRUN_EXE_CMD} -T ws -gu ${gu} -gp ${gp} runProgramInGuest \"${K8S_CENTOS7_CMD}\\${NODE_NAME}${i}\\${NODE_NAME}${i}.vmx\" /bin/bash /root/first.sh 13${i} ${NODE_NAME}${i}" >>  ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
    echo "ping -n 6 192.168.100.13${i}" >> ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
    echo "exit" >> ${K8S_CENTOS7_CMD}\\set_ip13${i}.bat
  done
}

VM_set_IP(){
  set_ip_master
  set_ip_node
  echo "-------------------执行 bat 脚本---------------------"
  `command` ./set_ip130.bat
  `command` ./set_ip131.bat
  `command` ./set_ip132.bat 
  rm -rf ./set_ip13*.bat
}

case $1 in
    set_ip)
        VM_set_IP
        ;;
    set_ip1)
        set_ip_master
        ;;
    set_ip2)
        set_ip_node
        ;;
    *)
        VM_set_IP
esac
```

:::

### first.sh设置主机名-网卡IP-UUID-hosts

配合`auto-clone.sh`脚本使用，来设置`主机名，网卡IP、UUID、hosts`

::: details 点击查看代码

```shell
#!/bin/bash

# 把first.sh脚本手动上传到CentOS7系统里的/root/first.sh，chmod -R 755 ./first.sh
# 复制到 vm-centos 虚拟机 /root/first.sh 里，配合 auto-clone.sh 使用

ip=$1
hostname=$2

echo -e "\n----------------------------------" >> first.log
echo "请求参数：IP：${ip}，HostName：${hostname}" >> first.log
echo "----------------------------------" >> first.log
if [ $# -ne 2 ];
then
  echo "sh $0 ip hostname" >> first.log
fi
UUID="ccb173d2-9470-4fc3-b894-cce7029f0455"
UUID=$(uuidgen ens33) || exit
echo "new UUID=\"${UUID}\"" >> first.log


function set_ip(){
  
# 设置IP
  sed -ri "/IPADDR/s#(.*.)\..*#\1.${ip}\"#" /etc/sysconfig/network-scripts/ifcfg-ens33
# 设置UUID
  sed -ri "s/UUID=.*/UUID=\"${UUID}\"/" /etc/sysconfig/network-scripts/ifcfg-ens33

# 设置hosts  
cat -s <<EOF | tee /etc/hosts >> first.log
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.100.130 master
192.168.100.131 node1
192.168.100.132 node2
EOF
  
  echo "----------------------------------------------" >> first.log
  # （sed -n '3,100p）读取文件的3-100行
  echo -e "cat /etc/hosts\n$(sed -n '3,100p' /etc/hosts)" >> first.log
  echo "==============================================" >> first.log
  echo "wait for systemctl restart network.service ..." >> first.log
  systemctl restart network.service >> first.log
  echo "==============================================" >> first.log
  echo "new IPADDR is : \"$(hostname -I)\"" >> first.log 
  echo ""
  cat /etc/sysconfig/network-scripts/ifcfg-ens33 >> first.log
  echo "==============================================" >> first.log
}


function set_hostname(){
  sed -i "s#.*#${hostname}#" /etc/hostname
  hostnamectl set-hostname ${hostname}
  echo "==============================================" >> first.log
  echo "new hostname is : \"$(cat /etc/hostname)\"" >> first.log
  echo "==============================================" >> first.log
}

main (){
  set_hostname
  sleep 3
  set_ip
  echo ">>>>>>>>>> set_ip & set_hostnameok OK!!  <<<<<<<<<" >> first.log
}

main
```

:::

### kill.bat

结束vmware进程：`kill.bat`

```bat
@echo off
echo=
for /f "tokens=2 delims= " %%i in ('tasklist  /fi "imagename eq vmware-vmx.exe" /nh') do taskkill /f /pid %%i
cmd
```


## 初始化k8s-yum源

::: details 点击查看代码

```shell
#!/bin/bash

# 创建好的虚拟机初始化配置

if [ -e "./k8s-centos7-yum.log" ]; then
    rm -rf ./k8s-centos7-yum.log
fi
touch ./k8s-centos7-yum.log


install(){
  echo "--> centos7配置"
  echo ""
  echo ""
  echo "----> 删除 /etc/yum.repos.d/"
  echo ""
  rms
  echo ""
  echo "----> 更新 yum 源"
  echo ""
  yum repolist all
  echo ""
  echo "----> 下载 华为 CentOS-Base.repo"
  echo ""
  #wget -O /etc/yum.repos.d/CentOS-Base-huawei.repo https://repo.huaweicloud.com/repository/conf/CentOS-7-reg.repo
  wget -O /etc/yum.repos.d/CentOS-Base-aliyun.repo https://mirrors.aliyun.com/repo/Centos-7.repo
  ls /etc/yum.repos.d/
  echo ""
  echo "----> 更新 yum 源"
  echo ""
  yum -y clean all && yum -y makecache && yum -y update && yum -y repolist all >> ./k8s-centos7-yum.log 2>&1
  echo ""
  echo "----> 查看 epel-release 版本：【$(yum list | grep epel-release)】"
  echo ""
  echo "----> 安装 epel-release"
  echo ""
  yum install -y epel-release
  echo ""
  echo ""
  ls /etc/yum.repos.d/
  echo ""
  echo "----> 修改 epel.repo 为 华为的配置"
  echo ""
  chmod -R 755 /etc/yum.repos.d/epel.repo
  ls -all /etc/yum.repos.d/
  echo ""
  echo ""
  sed -i "s/#baseurl/baseurl/g" /etc/yum.repos.d/epel.repo
  sed -i "s/metalink/#metalink/g" /etc/yum.repos.d/epel.repo
  sed -i "s@https\?://download.fedoraproject.org/pub@https://repo.huaweicloud.com@g" /etc/yum.repos.d/epel.repo
  echo "$(cat /etc/yum.repos.d/epel.repo)"
  echo ""
  echo "----> 更新 yum 源"
  echo ""
  yum -y clean all && yum makecache && yum -y update && yum repolist all
  echo ""
  echo "----> 删除 epel-testing.repo"
  echo ""
  if [ -e "/etc/yum.repos.d/epel-testing.repo" ]; then
    chmod -R 755 /etc/yum.repos.d/epel-testing.repo
    rm -rf /etc/yum.repos.d/epel-testing.repo
  fi
  echo ""
  
cat -s <<EOF > /etc/yum.repos.d/epel.repo
[epel]
name=Extra Packages for Enterprise Linux 7 - \$basearch
baseurl=https://repo.huaweicloud.com/epel/7/\$basearch
#metalink=https://mirrors.fedoraproject.org/#metalink?repo=epel-7&arch=$basearch
failovermethod=priority
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
EOF

   echo ""
   #sed -i "s/enabled=0/enabled=1/g" /etc/yum.repos.d/CentOS-Base.repo
   echo ""
  yum -y clean all && yum makecache && yum -y update && yum repolist all
  ls -all /etc/yum.repos.d/
  killall -2 tail
}

rms(){
 rm -rf /etc/yum.repos.d/CentOS*
 rm -rf /etc/yum.repos.d/elre*
 rm -rf /etc/yum.repos.d/epel*
 yum remove -y epel-release
 yum -y clean all
 yum -y makecache
}

case $1 in
  *)
    install >> ./k8s-centos7-yum.log 2>&1 & tail -f ./k8s-centos7-yum.log
    ;;
esac
```

:::

## 安装docker

[安装Docker文档](https://docs.docker.com/engine/install/)

::: details 点击查看代码

```shell
#!/bin/bash

# 安装docker

if [ -e "k8s-docker.log" ]; then
  rm -rf ./k8s-docker.log
fi
touch ./k8s-docker.log

kill_s(){
  # https://blog.csdn.net/qq_42476834/article/details/124719250
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> PID=$$,PPID=$PPID"
  # 2结束进程，3退出，9强制结束进程
  # kill -2 $$ #|| kill -3 $$ || kill -9 $$
  killall -2 tail
}

start(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 启动中 ..."
  systemctl start docker
  echo "----> 启动成功！"
  echo -e "\n"
}
restart(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 重新启动中 ..."
  systemctl restart docker
  echo "----> 重新启动成功！"
  echo -e "\n"
}
stop(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 停止进程中 ..."
  systemctl stop docker
  echo "----> 停止进程成功！"
  echo -e "\n"
}

enable(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 开启自动启动 ..."
  systemctl enable docker
  systemctl enable docker
  echo "----> 开启自动启动成功！"
  echo -e "\n"
}
disable(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 关闭自动启动 ..."
  systemctl disable docker
  echo "----> 关闭自动启动成功！"
  echo -e "\n"
}
status(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 当前状态 ..."
  echo "$(systemctl status docker)"
  echo -e "\n"
}
get_v(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 当前版本"
  echo "$(docker -v)"
  echo -e "\n"
}

waiting_input_version(){
  echo -e "\n"
#  echo -ne "[\e[0;31m15\e[0m]秒后将自动安装最新版，自定义请输入，如：3:20.10.8-3.el7\r"
#  sleep 15;
#  if read -p "请输入版本:" version;
#  then
#    echo "---->  自定义版本为:${version}"
#     yum install docker-ce-3:20.10.8-3.el7 docker-ce-cli-3:20.10.8-3.el7 containerd.io docker-compose-plugin
#    yum install -y docker-ce-${version}
#  else
#    echo "---->  自动安装最新版本"
    yum -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin >> ./k8s-docker.log 2>&1
#  fi
  echo -e "\n"
}

rm_file(){
  rm -rf /etc/yum.repos.d/docker-ce.repo
  rm -rf /etc/docker/
  echo -e "\n"
}

uninstall(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 准备卸载旧版本"
for i in $(rpm -qa | grep docker*) ; do
  echo "----> 软件包 ${i} 将被 删除..."
done
for i in $(rpm -qa | grep docker*) ; do
  echo "----> 正在删除 ${i} ..."
  yum remove -y ${i}
  yum remove -y docker-ce docker-ce-cli containerd.io
  rm_file
done
echo -e "\n"
}

install_tool(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 安装依赖 ..."
  yum install -y yum-utils device-mapper-persistent-data lvm2
  echo -e "\n"

}


daemon_reload(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 设置镜像加速 ..."
cat -s <<EOF > /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "registry-mirrors": [
    "https://04eo9xup.mirror.aliyuncs.com",
    "https://098cc8006500f4db0f2fc01937bbce40.mirror.swr.myhuaweicloud.com"
  ]
}
EOF

echo -e "----> 写入文件[/etc/docker/daemon.json] 成功！\n等待重新加载本地文件。"
systemctl daemon-reload
echo "----> 重新加载完成。"
echo -e "\n"
}

huawei_install(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 华为源 配置&安装"
  # step 1: 安装必要的一些系统工具
  install_tool
  # Step 2: 添加软件源信息
  echo "----> 下载repo文件 ..."
  wget -O /etc/yum.repos.d/docker-ce.repo https://repo.huaweicloud.com/docker-ce/linux/centos/docker-ce.repo
  # Step 3 修改repo
  echo -e "----> 更新 docker-repo\n"
  sed -i 's+download.docker.com+repo.huaweicloud.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
  # Step 4
  echo -e "\n-------------------------------------------------\n"
  echo "---->  更新仓库索引 ..."
  yum clean all >> ./k8s-docker.log 2>&1
  sleep 4;
  yum makecache >> ./k8s-docker.log 2>&1
  sleep 4;
  yum repolist all >> ./k8s-docker.log 2>&1
  echo -e "\n-------------------------------------------------\n"
  echo "---->  查看docker可用版本 ..."
  echo -e "\n"
  yum list docker-ce.x86_64 --showduplicates | sort -r
  echo -e "\n-------------------------------------------------\n"
  sleep 10;
  echo "---->  正在安装 ..."
  echo -e "\n"
  waiting_input_version
  # Step 4: 开启Docker服务
  sleep 8;
  start
  sleep 12;
  enable
  sleep 10;
  status
  sleep 10;
  daemon_reload
  restart
  sleep 10;
  usermod -aG docker a
  docker images
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n"

}

ali_install(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 阿里源 配置&安装"
  # step 1: 安装必要的一些系统工具
  install_tool
  # Step 2: 添加软件源信息
  echo "----> 下载repo文件 ..."
  yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
  # Step 3
  echo -e "----> 更新 docker-repo\n"
  sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
  # Step 4
  echo -e "\n-------------------------------------------------\n"
  echo "---->  更新仓库索引 ..."
  yum clean all >> ./k8s-docker.log 2>&1
  yum makecache >> ./k8s-docker.log 2>&1
  echo -e "\n-------------------------------------------------\n"
  echo "---->  查看docker可用版本 ..."
  echo -e "\n"
  yum list docker-ce.x86_64 --showduplicates | sort -r
  echo -e "\n-------------------------------------------------\n"
  sleep 10;
  echo "---->  开始安装 ..."
  echo -e "\n"
  waiting_input_version
  # Step 4: 开启Docker服务
  sleep 8;
  start
  sleep 12;
  enable
  sleep 10;
  status
  sleep 10;
  daemon_reload
  restart
  sleep 10;
  usermod -aG docker a
  docker images
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n"
}


main(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> docker 安装"
  uninstall >> ./k8s-docker.log 2>&1
  huawei_install >> ./k8s-docker.log 2>&1
  get_v
  sleep 10;
  kill_s
}

m1(){
huawei_install
kill_s
}
m2(){
ali_install
kill_s
}
m3(){
uninstall
kill_s
}
m4(){
start
kill_s
}
m5(){
stop
kill_s
}
m6(){
status
kill_s
}
m7(){
enable
kill_s
}
m8(){
disable
kill_s
}
m9(){
rm_file
kill_s
}

case $1 in
  in_huawei)
    m1 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  in_ali)
    m2 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  uni)
    m3 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  start)
    m4 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  stop)
    m5 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  status)
    m6  >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  enable)
    m7 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  disable)
    m8 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  rm)
    m9 >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
  -h)
    echo "sh $0 { * | in_huawei | in_ali | uni | start | stop | status | enable | disable | rm | -h }"
    ;;
  *)
    main >> ./k8s-docker.log 2>&1 & tail -f ./k8s-docker.log;;
esac
```

:::



## K8S基础环境init配置



::: details 点击查看代码

```shell
#!/bin/bash

# 基础环境配置

if [ -e "k8s-init.log" ]; then
  rm -rf ./k8s-init.log
fi
touch ./k8s-init.log

# k8s基础环境配置：k8s依赖|源
kill_s(){
  # https://blog.csdn.net/qq_42476834/article/details/124719250
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> PID=$$,PPID=$PPID"
  # 2结束进程，3退出，9强制结束进程
  #|| kill -3 $$ || kill -9 $$
  kill -2 $$
  killall -2 tail
}

rm_file(){
  echo -ne "--> 准备清理：/etc/sysconfig/modules/ipvs.modules：\r"
  rm -rf /etc/sysconfig/modules/ipvs.modules
  ls /etc/sysconfig/modules/
  echo "--> 准备清理：/etc/sysctl.d/k8s.conf"
  rm -rf /etc/sysctl.d/k8s.conf
  echo "--> 准备清理：/etc/modules-load.d/k8s.conf"
  rm -rf /etc/modules-load.d/k8s.conf
  echo "--> 准备清理：/etc/sysctl.d/10-network-security.conf"
  rm -rf /etc/sysctl.d/10-network-security.conf
  ls /etc/sysctl.d/
  echo "--> 准备清理：/etc/yum.repos.d/k8s.repo"
  rm -rf /etc/yum.repos.d/kubernetes.repo
  ls /etc/yum.repos.d/
  echo "--> 更新仓库缓存"
  yum clean all >> ./k8s-init.log 2>&1
  echo ""
  yum makecache >> ./k8s-init.log 2>&1
  echo -e "\n"
}

set_IPVS(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 开启 IPVS 支持"
cat -s <<EOF > /etc/sysconfig/modules/ipvs.modules
#!/bin/bash
ipvs_modules="ip_vs ip_vs_lc ip_vs_wlc ip_vs_rr ip_vs_wrr ip_vs_lblc ip_vs_lblcr ip_vs_dh ip_vs_sh ip_vs_fo ip_vs_nq ip_vs_sed ip_vs_ftp nf_conntrack"
for kernel_module in ${ipvs_modules}; do
  /sbin/modinfo -F filename ${kernel_module} > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    /sbin/modprobe ${kernel_module}
  fi
done
EOF

echo -e "\n"

chmod 755 /etc/sysconfig/modules/ipvs.modules
echo "----> start IPVS：[sh /etc/sysconfig/modules/ipvs.modules]"
sh /etc/sysconfig/modules/ipvs.modules
echo "----> lsmod | grep ip_vs"
lsmod | grep ip_vs
echo -e "\n"
}

# 将桥接的IPv4流量传递到iptables的链
# /usr/lib/sysctl.d/00-system.conf 与之相同
k8s_conf(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 允许 iptables 检查桥接流量"

echo "----> 写入 [/etc/modules-load.d/k8s.conf]"
cat -s <<EOF > /etc/modules-load.d/k8s.conf
br_netfilter
EOF

echo "----> 写入 [/etc/sysctl.d/k8s.conf]"
cat -s <<EOF > /etc/sysctl.d/k8s.conf
# For binary values, 0 is disabled, 1 is enabled
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness=0
EOF

echo -e "\n"

echo "----> modprobe br_netfilter"
modprobe br_netfilter
echo "----> start iptables：[sysctl -p /etc/sysctl.d/k8s.conf]"
sysctl -p /etc/sysctl.d/k8s.conf
echo -e "----> start：[sysctl --system]"
sysctl --system
echo -e "----> lsmod | grep br_netfilter"
lsmod | grep br_netfilter
echo -e "\n"
}

#开启网络安全
#与 /usr/lib/sysctl.d/50-default.conf 类似
k8s_conf_10_network_security_conf(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 开启网络安全"
cat -s <<EOF > /etc/sysctl.d/10-network-security.conf
net.ipv4.conf.default.rp_filter=1
net.ipv4.conf.all.rp_filter=1
EOF

echo ""
echo "----> start 网络安全：[sysctl --system]"
#生效
sysctl --system
echo -e "\n"
}

#时间同步
time_sync(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 时间同步"
rm -rf /var/run/yum.pid
yum install -y chrony
systemctl enable chronyd
systemctl start chronyd
timedatectl set-ntp true
timedatectl set-timezone Asia/Shanghai
echo "----> 时区状态：timedatectl status"
timedatectl status
echo "----> 检测：chronyc activity -v"
chronyc activity -v
yum -y install ntpdate
yum install -y ntpsec-ntpdate
ntpdate time.windows.com
echo -e "\n"
}

k8s_repo(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 设置 k8s_repo 仓库源"
cat -s <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

echo -e "\n"
echo "----> 更新仓库缓存"
yum -y clean all >> ./k8s-init.log 2>&1
echo -e "\n"
sleep 3;
yum -y makecache >> ./k8s-init.log 2>&1
echo -e "\n"
sleep 3;
yum -y update >> ./k8s-init.log 2>&1
echo -e "\n"
sleep 3;
yum repolist all >> ./k8s-init.log 2>&1
echo -e "\n"
}

alias_0(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 设置 alias"
cat -s <<EOF > ~/.bashrc


# .bashrc
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias rmf='rm -rf'
alias ll='ls -l'
alias la='ls -all'

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi


alias getgroup='cat /etc/group'
alias getpasswd='cat /etc/passwd'

alias stdk='systemctl start docker'
alias restdk='systemctl restart docker'
alias stopdk='systemctl stop docker'
alias enabledk='systemctl enable docker'
alias disabledk='systemctl disable docker'
alias statusdk='systemctl status kubectl'

alias stk8s='systemctl start kubectl'
alias restk8s='systemctl restart kubectl'
alias stopk8s='systemctl stop kubectl'
alias enablek8s='systemctl enable kubectl'
alias disablek8s='systemctl disable kubectl'
alias statusk8s='systemctl status kubectl'


########k8s############
###########k8s-创建与删除
alias k='kubectl'
alias kaf='kubectl apply -f' #使用yaml创建apps
alias kdf='kubectl delete -f' #删除yaml创建apps
###########k8s-资源信息
alias kg='kubectl get'
alias kgnodes='kubectl get nodes -o wide' #获取node资源信息
alias kgpods='kubectl get pods -o wide' #获取pods资源信息
alias kgingress='kubectl get ingress -owide' #获取ingress资源信息
###########k8s-名称空间
alias kgns='kubectl get ns' #获取所有名称空间
alias kgall='kubectl get all -o wide' #获取所有apps-pod-service
###########k8s-svc服务信息
alias kgsvc='kubectl get svc'
alias kgsvc-n='kubectl get svc -n $1' #自定义名称空间的svc查询
alias kgsvc-k8s='kubectl get svc -n kube-system -o wide' #获取k8s服务
alias kgsvc-ing='kubectl get svc -n ingress-nginx -o wide' #获取ingress服务
###########k8s-pod信息
alias kgpod='kubectl get pod --show-labels' #查看k8s的pod信息
alias kgpod-show='kubectl get pod --show-labels'
alias kgpodw='watch kubectl get pod -n kube-system -o wide'	#监控k8s-pod的kube-system进度
###########k8s-pods信息
alias kgpodsallns='kubectl get pods --all-namespaces -o wide' #获取pods所有名称空间
alias kgpodsn='kubectl get pods -o wide -n $1' #查看输入的【kgpodsallns】名称空间信息
alias kgpodsn-k8s='kubectl get pods -n kube-system -o wide' #查看名称空间kube-system的信息
alias kgpodsn-ingressnginx='kubectl get pods -n ingress-nginx -o wide' #查看名称空间ingress-nginx的信息
alias kgpodsn-node='kubectl get pods -n kube-system -o wide | grep $1' #查看node子节点的pod信息
###########k8s-describe信息
alias kdesc-node='kubectl describe node $1' #传入node主机名称
alias kdesc-pod='kubectl describe pod -n $1' #传入名称空间
###########k8s-log信息
alias klog='kubectl logs -n $1' #传入名称空间
alias klog='kubectl logs $1' #传入svc的名称【tomcat-b8cdc6f6b-7ngdx】
###########k8s-系统操作部分
alias ks='kubectl set' #设置应用资源
alias ke='kubectl edit' #编辑资源
alias kc='kubectl create' #创建资源
alias kd='kubectl delete' #删除
alias krollout='kubectl rollout' #输出、查看、回滚
alias klabel='kubectl label' #更新资源对象的label
alias kpatch='kubectl patch' #更新资源对象字段
###########k8s-快捷键提示
source <(kubectl completion bash)

########docker############
alias dkse='docker search'      #镜像名称
alias dklogin='docker login'    #登录远程镜像仓库
alias dkpull='docker pull'      #镜像名称
alias dkcommit='docker commit'  #提交容器为镜像         [-a='作者' -m='备注' 运行时容器ID 新镜像名称]
alias dkb='docker build'        #file文件构建镜像       [-f [DockerFile文件] -t [设置标签]:版本 . ]
alias dktag='docker tag'        #设置镜像为阿里|xx标签  [容器ID [设置标签]:version]
alias dkpush='docker push'      #镜像提交到仓库         [输入设置好的标签:verison]
alias dki='docker images'       #镜像名称or镜像Id
alias dkrmi='docker rmi'        #镜像名称or镜像Id
alias dkrmif='docker rmi -f'
alias dkrmia='docker rmi \$(docker images -q)' #自动删除没有启动的镜像
alias dkps='docker ps'  #在运行的容器
alias dkpsa='docker ps -a'      #全部容器
alias dkstart='docker start'    #容器名称or容器Id
alias dkrestart='docker restart'  #容器名称or容器Id
alias dkstop='docker stop'      #stop 容器名称or容器Id
alias dkkill='docker kill'      #docker kill 容器ID or 容器名
alias dkrm='docker rm'  #docker rm 容器id
alias dkrmf='docker rm -f'      #容器ID1  容器ID2 中间空格隔开
alias dkrma='docker rm \$(docker ps -a -q)'      #自动删除所有停止的容器
alias dkcp='docker cp'
alias dklogs='docker logs'
EOF

bash
bash
bash
echo "----> alias"
alias
echo -e "\n"
}

main(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n------------> k8s基础环境配置：k8s依赖|仓库源"
yum install -y net-tools >> ./k8s-init.log 2>&1
sed -ri 's/#PermitRootLogin yes/PermitRootLogin yes/g' /etc/ssh/sshd_config
set_IPVS
k8s_conf
k8s_conf_10_network_security_conf
time_sync
k8s_repo
yum install -y nfs-utils >> ./k8s-init.log 2>&1
yum install -y socat conntrack ebtables ipset ipvsadm >> ./k8s-init.log 2>&1
kill_s
}

m1(){
set_IPVS
kill_s
}
m2(){
k8s_conf
kill_s
}
m3(){
k8s_conf_10_network_security_conf
kill_s
}
m4(){
time_sync
kill_s
}
m5(){
k8s_repo
kill_s
}
m6(){
rm_file  >> ./k8s-init.log 2>&1
kill_s
}
case $1 in
  set_IPVS)
    m1 >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log
    ;;
  k8s_conf)
    m2 >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log
    ;;
  k8s_conf_net)
    m3 >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log
    ;;
  time_sync)
    m4 >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log
    ;;
  k8s_repo)
    m5 >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log
    ;;
  alias_0)
    alias_0;;
  rm)
    m6 & tail -f ./k8s-init.log
    ;;
  -h)
    echo "sh $0 { * | set_IPVS | k8s_conf | k8s_conf_net | time_sync | k8s_repo | alias_0 | rm | -h }";;
  *)
    main >> ./k8s-init.log 2>&1 & tail -f ./k8s-init.log;;
esac
```

:::

## install-k8s

::: details 点击查看代码

```shell
#!/bin/bash

# 安装k8s-1.27.8

if [ -e "k8s-install.log" ]; then
  rm -rf ./k8s-install.log
fi
touch ./k8s-install.log

kill_s(){
  # https://blog.csdn.net/qq_42476834/article/details/124719250
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> PID=$$,PPID=$PPID"
  # 2结束进程，3退出，9强制结束进程
  #kill -2 $$ #|| kill -3 $$ || kill -9 $$
  killall -2 tail
}

start(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 启动中 ..."
  systemctl start kubelet
  echo "----> 启动成功！"
  echo -e "\n"
}
restart(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 重新启动中 ..."
  systemctl restart kubelet
  echo "----> 重新启动成功！"
  echo -e "\n"
}
stop(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 停止进程中 ..."
  systemctl stop kubelet
  echo "----> 停止进程成功！"
  echo -e "\n"
}

enable(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 开启自动启动 ..."
  systemctl enable kubelet
  echo "----> 开启自动启动成功！"
  echo -e "\n"
}
disable(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 关闭自动启动 ..."
  systemctl disable kubelet
  echo "----> 关闭自动启动成功！"
  echo -e "\n"
}
status(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 当前状态"
  echo "$(systemctl status kubelet)"
  echo "----> kubelet.service - kubelet: The Kubernetes Node Agent，属于正常，k8s集群还没有配置完！"
  echo -e "\n"
}
get_v(){
	echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 当前版本"
	echo ""
	echo "----> kubeadm version"
	echo "$(kubeadm version)"
	echo ""
	echo "----> kubelet --version"
	echo "$(kubelet --version)"
	echo ""
	echo "----> kubectl version"
	echo "$(kubectl version)"
	echo -e "\n"
}

uni_rm_file(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> k8s 卸载 stop 服务"
  for service in kube-apiserver kube-controller-manager kubectl kubelet kube-proxy kube-scheduler;
  do
    echo "----> stop $service"
    systemctl stop $service
  done
  kubectl delete node --all
  kubeadm reset -f
  echo ""
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 准备卸载旧版本"
  for i in $(rpm -qa | grep kube*) ; do
     echo "----> 软件包 ${i} 将被 删除..."
  done
  for i in $(rpm -qa | grep kube*) ; do
     echo "----> 正在删除 ${i} ..."
     yum remove -y ${i}
  done

  #yum remove -y kubeadm-1.27.8-0 kubelet-1.27.8-0 kubectl-1.27.8-0

  # 这里最好不好执行，否则，清除后，重新安装后会找不到【kubeadm: 未找到命令、kubelet: 未找到命令、kubectl: 未找到命令】
  rm -rf ~/.kube/
  rm -rf /etc/kubernetes/
  rm -rf /etc/systemd/system/kubelet.service.d
  rm -rf /etc/systemd/system/kubelet.service
  rm -rf /usr/local/bin/kube*
  rm -rf /usr/bin/kube*
  rm -rf /etc/cni
  rm -rf /opt/cni
  rm -rf /var/lib/etcd
  rm -rf /var/etcd
  echo -e "----> k8s 卸载完成\n---->更新仓库"
  yum -y clean all >> ./k8s-install.log 2>&1
  sleep 3;
  yum -y makecache >> ./k8s-install.log 2>&1
  sleep 3;
  echo -e "\n"
}

masters="master"
nodes="node"
hostnames="$(hostname)"
k8sVersion="1.27.8-0"
install(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> k8s 安装 ..."
  echo "----> 查看 k8s 可用版本"
  echo -e "\n$(yum list kube*)\n\n"
  sleep 5;
  #if [[  ${hostnames} == ${masters}* ]] ; then
  #  echo -e "\n"
  #  echo "----> install k8s-${k8sVersion} for ${hostnames}..."
  #  yum install -y kubeadm-${k8sVersion} kubelet-${k8sVersion} kubectl-${k8sVersion}
#	sleep 3;
#	start
#	sleep 10;
#	enable
#	enable
#	sleep 10;
#	status
#	get_v
#	sleep 1;
	#--disableexcludes=kubernetes
#   echo -e "\n"
#	kill_s
#  elif [[ ${hostnames} == ${nodes}[0-9]* ]] ; then
    echo -e "\n"
    echo "----> install k8s-${k8sVersion} for ${hostnames}..."
	yum install -y kubeadm-${k8sVersion} kubelet-${k8sVersion} kubectl-${k8sVersion} --disableexcludes=kubernetes
	sleep 5;
	start
	sleep 10;
	enable
	enable
	sleep 10;
	status
	get_v
	sleep 1;
    echo -e "\n"
	if [ -f /usr/bin/kubectl ]; then
		echo "----> 创建软连接..."
		ln -s /usr/bin/kube*  /usr/local/bin/
		echo -e "\n"
	fi
	kill_s
#  else
#    echo "----> hostname is [${hostnames}]不符合规范"
#	kill -9 $$
#  fi
#  echo -e "\n"
}

main(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> k8s 安装..."
#uni_rm_file
install >> ./k8s-install.log 2>&1
}

m1(){
install
kill_s
}
m2(){
uni_rm_file
kill_s
}
m3(){
start
kill_s
}
m4(){
stop
kill_s
}
m5(){
status
kill_s
}
m6(){
enable
kill_s
}
m7(){
disable
kill_s
}

case $1 in
   install)
     m1 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   uni)
     m2 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   start)
     m3 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   stop)
     m4 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   status)
     m5 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   enable)
     m6 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
   disable)
     m7 >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log & ;;
  -h)
    echo "sh $0 { *默认执行 | install | uni | start | stop | status | enable | disable | -h }"
    ;;
   *)
     main >> ./k8s-install.log 2>&1 & tail -f ./k8s-install.log;;
esac
```

:::


