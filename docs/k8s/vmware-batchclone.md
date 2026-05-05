---
icon: linux
title: VMware批量搭建配置k8s主机集群
category: 
- kubernetes
date: 2020-01-01
order: 2
tag:
- VMware
- k8s
---

VMware基于Centos7、Ubuntu模板来批量克隆并配置k8s基础环境依赖，自动修改IP-hostname来搭建本地k8s主机集群【1主2从】。

<!-- more -->

## 配置k8s基础环境依赖

- 1、启用root用户登录。[ssh](./ssh.md#启用root用户登录)
- 2、在Ubuntu模板里配置k8s基础环境依赖（配置网络、net-tools、containerd、关闭防火墙、禁用selinux、禁用swap分区、开启IPVS支持、IPv4流量传递、network-security开启网络安全、时间同步、配置软件源、开启 ssh 远程登录）[具体配置跳转-环境准备k8s-init](./basis.md#环境准备k8s-init)


## 自动创建集群系统

根据CentOS7模板镜像自动创建集群系统 `auto-clone.sh`

[CentOS7模板镜像地址](https://pan.baidu.com/s/1K84oi2qsF33WnNrgqbJ_NA)，提取码：`1234`


### 文件放置规范

```
F:
|-- CentOS7		#模板镜像，已经配置好内核版本、yum源等。
|------ CentOS7.vmx
|------ CentOS7.vmxf
|------ CentOS7.vmdk
|-- ubuntu
|----- master		#auto_VM克隆CentOS7生成的master
|-------- master.vmx
|-------- master.vmxf
|-------- master.vmdk
|----- node1		#auto_VM克隆CentOS7生成的node1
|-------- node1.vmx
|-------- node1.vmxf
|-------- node1.vmdk
|----- node2: ...
|
|-- auto-clone.sh	#自动克隆系统脚本，与CentOS7模板镜像处于同一位置。
|-- kill.bat	#结束vmware进程
|-- CentOS7.7z	#打包CentOS7模板镜像，使用时需要解压
```


## bat脚本

结束vmware进程：`kill.bat`

```bat

###### kill.bat

@echo off
echo=
for /f "tokens=2 delims= " %%i in ('tasklist  /fi "imagename eq vmware-vmx.exe" /nh') do taskkill /f /pid %%i
cmd

###### 删除k8s集群主机
@echo off
rmdir /s /q F:\ubuntu
md F:\ubuntu

###### restart
@echo off
E:\\rjcode\\VMware\\vmrun.exe -T ws stop F:\\ubuntu\\master\\master.vmx
E:\\rjcode\\VMware\\vmrun.exe -T ws start F:\\ubuntu\\master\\master.vmx

E:\\rjcode\\VMware\\vmrun.exe -T ws stop F:\\ubuntu\\node1\\node1.vmx
E:\\rjcode\\VMware\\vmrun.exe -T ws start F:\\ubuntu\\node1\\node1.vmx

E:\\rjcode\\VMware\\vmrun.exe -T ws stop F:\\ubuntu\\node2\\node2.vmx
E:\\rjcode\\VMware\\vmrun.exe -T ws start F:\\ubuntu\\node2\\node2.vmx
```


## 安装对window格式的 sh 脚本转码 dos2unix

```shell
[root@master ~]# yum install -y dos2unix
已加载插件：fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * elrepo: hkg.mirror.rackspace.com
 
[root@master ~]# ls
anaconda-ks.cfg  first.sh  get_UUID.sh

[root@master ~]# dos2unix first.sh
dos2unix: converting file first.sh to Unix format ...

[root@master ~]# sh first.sh 129 master0
new UUID="eddedb45-b871-4eea-8433-4c08103423e1"
```


## 编写first.sh脚本

上传到模板镜像的`/root/` 目录下

赋予权限：`chmod +x /root/first.sh`

::: tabs#a

@tab Centos#Centos

```shell :collapsed-lines=15
#!/bin/bash

# 把first.sh脚本手动上传到CentOS7系统里的/root/first.sh，chmod +x ./first.sh
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
192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2
EOF
  
  echo "----------------------------------------------" >> first.log
  # （sed -n '3,100p）读取文件的3-100行
  echo -e "cat /etc/hosts\n$(sed -n '3,100p' /etc/hosts)" >> first.log
  echo "==============================================" >> first.log
  echo "wait for systemctl restart network.service ..." >> first.log
  service network restart
  sleep 3
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

@tab Ubuntu#Ubuntu

```shell :collapsed-lines=15
#!/bin/bash

# 把first.sh脚本手动上传到Ubuntu系统里的/root/first.sh，chmod -R 755 ./first.sh

ip=$1
hostname=$2

echo -e "\n----------------------------------"
echo "请求参数：IP：${ip}，HostName：${hostname}"
echo "----------------------------------"
if [ $# -ne 2 ];
then
  echo "sh $0 ip hostname"
fi


function set_ip(){

# 设置IP addresses: [192.168.0.129/24]
  sed -i "s/addresses:\s[[0-9\.]*\/24*]/addresses: [192.168.0.${ip}\/24]/g" /etc/netplan/50-cloud-init.yaml

# 设置hosts
cat -s <<EOF | tee /etc/hosts
127.0.0.1 localhost
127.0.1.1 ubuntu24
192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
EOF

  sed -i "s/[0-9\.].*24/127.0.1.1 ${hostname}/g"

  
  echo "----------------------------------------------"
  # （sed -n '3,100p）读取文件的3-100行
  echo -e "cat /etc/hosts\n$(sed -n '1,30p' /etc/hosts)"
  echo "=============================================="
  echo "wait for netplan apply ..."
  netplan apply
  sleep 3
  ip addr show
  echo "=============================================="
  echo "new IPADDR is : \"$(hostname -I)\""
  echo ""
  cat /etc/netplan/50-cloud-init.yaml
  echo "=============================================="
}


function set_hostname(){
  sed -i "s#.*#${hostname}#" /etc/hostname
  hostnamectl set-hostname ${hostname}
  echo "=============================================="
  echo "new hostname is : \"$(cat /etc/hostname)\""
  echo "=============================================="
}

main (){
  set_hostname
  sleep 3
  set_ip
  echo ">>>>>>>>>> set_ip & set_hostnameok OK!!  <<<<<<<<<"
}

main
```

:::



## auto_clone.sh

```shell :collapsed-lines=15
#!/bin/bash

# 把first.sh脚本手动上传到Rocky系统里的/root/first.sh，chmod -R 755 ./first.sh
# 在vmware手动克隆虚拟机，并开机，修改IP+hostname
# 在 Rocky Linux 10 中，传统的 /etc/sysconfig/network-scripts/ 已被弃用，网络配置统一由 NetworkManager 管理，并使用 keyfile 存储在 /etc/NetworkManager/system-connections/ 下
# ubuntu位于 /etc/netplan
# dnf替代yum
#hostname：ubuntu24
#ip：0.129
#ubuntu：123456a

echo -e "本镜像环境：\nUbuntu2404- \nKernel：6.8.0-110-generic \n"


host_master=(130)
host_node=(131 132)
gu="root"
gp="123456a"

#模板镜像位置，可自由修改
VMX_FILE="$(pwd)/Ubuntu2404/Ubuntu2404.vmx"
VMX_FILE_2="\\Ubuntu2404\\Ubuntu2404.vmx"


# vmrun.exe 位置
PATH_VMRUN_EXE_CMD="E:\\rjcode\\VMware\\vmrun.exe"
# 集群机器位置
VM_CMD="F:\\"
K8S_CMD="F:\\ubuntu"
#服务器名称
MASTER_NAME="master"
NODE_NAME="node"

# master 修改IP地址
set_clone_master(){
  for i in {0..1};
  do
    >  ${VM_CMD}\\k8s-master13${i}.bat
	# 创建快照
	echo "${PATH_VMRUN_EXE_CMD} -T ws snapshot ${VM_CMD}${VMX_FILE_2} ubuntu24init" >> ${VM_CMD}\\k8s-master13${i}.bat
	# 根据快照来clone镜像
	echo "${PATH_VMRUN_EXE_CMD} -T ws clone ${VM_CMD}${VMX_FILE_2} ${K8S_CMD}\\${MASTER_NAME}\\${MASTER_NAME}.vmx full -snapshot=ubuntu24init -cloneName=${MASTER_NAME}" >> ${VM_CMD}\\k8s-master13${i}.bat
	# 启动虚拟机 gui：打开vm应用；nogui：不打开vm应用
	echo "${PATH_VMRUN_EXE_CMD} -T ws start ${K8S_CMD}\\${MASTER_NAME}\\${MASTER_NAME}.vmx" >> ${VM_CMD}\\k8s-master13${i}.bat
    echo "${PATH_VMRUN_EXE_CMD} -T ws -gu ${gu} -gp ${gp} runProgramInGuest \"${K8S_CMD}\\${MASTER_NAME}\\${MASTER_NAME}.vmx\" /bin/bash /root/first.sh 13${i} ${MASTER_NAME}" >> ${VM_CMD}\\k8s-master13${i}.bat
    echo "ping -n 6 192.168.0.13${i}" >> ${VM_CMD}\\k8s-master13${i}.bat
	echo "exit" >> ${VM_CMD}\\k8s-master13${i}.bat
  done
  
}

# node 修改IP地址
set_clone_node(){
  for i in {1..2};
  do
    >  ${VM_CMD}\\k8s-node13${i}.bat
	# 根据快照来clone镜像
	echo "${PATH_VMRUN_EXE_CMD} -T ws clone ${VM_CMD}${VMX_FILE_2} ${K8S_CMD}\\${NODE_NAME}${i}\\${NODE_NAME}${i}.vmx full -snapshot=ubuntu24init -cloneName=${NODE_NAME}${i}" >> ${VM_CMD}\\k8s-node13${i}.bat
	# 启动虚拟机 gui：打开vm应用；nogui：不打开vm应用
	echo "${PATH_VMRUN_EXE_CMD} -T ws start ${K8S_CMD}\\${NODE_NAME}${i}\\${NODE_NAME}${i}.vmx" >> ${VM_CMD}\\k8s-node13${i}.bat
    echo "${PATH_VMRUN_EXE_CMD} -T ws -gu ${gu} -gp ${gp} runProgramInGuest \"${K8S_CMD}\\${NODE_NAME}${i}\\${NODE_NAME}${i}.vmx\" /bin/bash /root/first.sh 13${i} ${NODE_NAME}${i}" >>  ${VM_CMD}\\k8s-node13${i}.bat
    echo "ping -n 6 192.168.0.13${i}" >> ${VM_CMD}\\k8s-node13${i}.bat
    echo "exit" >> ${VM_CMD}\\k8s-node13${i}.bat
  done
}

main(){
  if [ -e ${VMX_FILE} ]; then
    set_clone_master
    set_clone_node
    # 删除快照
    echo "${PATH_VMRUN_EXE_CMD} -T ws deleteSnapshot ${VM_CMD}${VMX_FILE_2} ubuntu24init" >> ${VM_CMD}\\delete_Snapshot.bat
	# 删除bat脚本
    echo "del k8s-*" >> ${VM_CMD}\\delete_Snapshot.bat

    echo -e "\n-------------------执行 bat 脚本---------------------\n"
    `command` ./k8s-master130.bat
    `command` ./k8s-node131.bat
    `command` ./k8s-node132.bat
    `command` ./k8s-node133.bat
    `command` ./k8s-delete_Snapshot.bat

  else
	echo -e ">>>>>>>>>> 没有模板镜像 <<<<<<<<<<"
	echo -e ">>>>>>>>>> 模板镜像下载地址：https://pan.baidu.com/s/1K84oi2qsF33WnNrgqbJ_NA 密码：1234 <<<<<<<<<< \n"
	# 1、下载安装7z： https://www.7-zip.org/
	# 2、配置环境变量：打开编辑环境变量，选择环境变量，在系统变量下的 path 中添加你的7zip安装位置，如 C:\Program Files\7-Zip\，一路确认，关闭窗口
	# 3、打开cmd，输入7z命令，查看是否可用
	# 7z x -o[output_dir] archive_name 【-o[output_dir] 输出文件夹，举例：-otest 表示当前目录下的 test 文件夹下，不写就是当前目录；-o 和文件夹名称要连着写】
	echo "7z x Ubuntu2404.7z" >> ${VM_CMD}\\u7z.bat
	echo "del k8s-*" >> ${VM_CMD}\\u7z.bat	
	echo "解压 Ubuntu2404.7z"
	`command` ./u7z.bat
	# 调用main
	main
  fi
}

case $1 in
    master)
        set_clone_master
        ;;
    node)
        set_clone_node
        ;;
	h)
        echo "sh auto_clone.sh [选项]; 选项【master【clone master系统】；node【clone node系统】；】"
        ;;
    *)
        main
esac
```


## vmrun语法

<https://docs.vmware.com/cn/>

### 语法：vmrun [身份验证标志] 命令 [参数]


```shell :collapsed-lines=13
身份验证标志
--------------
这些必须出现在命令和任何命令参数之前。
   -T <主机类型> (ws|fusion||player)
   -vp <加密虚拟机的密码>
   -gu <来宾操作系统中的用户名>
   -gp <guest OS 中的密码>

电源命令             参数             描述
--------------           ----------           -----------
start                    .vmx 文件的路径       启动虚拟机或团队
                         [gui|nogui]
stop                     .vmx 文件的路径       停止虚拟机或团队
                         [hard|soft]
reset                    .vmx 文件的路径       重置 VM 或团队
                         [hard|soft]
suspend                  .vmx 文件的路径       暂停 VM 或团队
                         [hard|soft]
pause                    .vmx 文件的路径       暂停虚拟机
unpause                  .vmx 文件的路径       取消暂停虚拟机

快照命令           参数              描述
-----------------        ----------           -----------
listSnapshots            .vmx 文件的路径       列出 VM 中的所有快照
                         [showTree]
snapshot                 .vmx 文件的路径       创建 VM 的快照
                         Snapshot name
deleteSnapshot           .vmx 文件的路径       从 VM 中删除快照
                         Snapshot name
                         [andDeleteChildren]
revertToSnapshot         .vmx 文件的路径       将 VM 状态设置为快照
                         快照名称

主机网络命令        参数               描述
---------------------    ----------           -----------
listHostNetworks                               列出主机中的所有网络
listPortForwardings      主机网络名称       列出主机网络上所有可用的端口转发
setPortForwarding        主机网络名称       在主机网络上添加或更新端口转发
                         Protocol
                         Host port
                         Guest ip
                         Guest port
                         [Description]
deletePortForwarding     Host network name    删除主机网络上的端口转发
                         Protocol
                         Host port

嘉宾命令        参数               描述
-----------------        ----------           -----------
runProgramInGuest        .vmx 文件的路径      在来宾操作系统中运行程序
                         [-noWait]
                         [-activeWindow]
                         [-interactive]
                         完整路径到程序
                         [程序参数]
runScriptInGuest         .vmx 文件的路径      在来宾操作系统中运行脚本
                         [-noWait]
                         [-activeWindow]
                         [-interactive]
                         解释器路径
                         脚本文本
fileExistsInGuest        .vmx 文件的路径      检查来宾操作系统中是否存在文件
                         来宾中的文件路径
directoryExistsInGuest   .vmx 文件的路径      检查来宾操作系统中是否存在目录
                         来宾目录的路径
setSharedFolderState     .vmx 文件的路径      修改主客共享文件夹
                         共享名称
                         Host path
                         writable | readonly
addSharedFolder          .vmx 文件的路径      添加主客共享文件夹
                         共享名称
                         新主机路径
removeSharedFolder       .vmx 文件的路径      删除主客共享文件夹
                         共享名称
enableSharedFolders      .vmx 文件的路径      在来宾系统中启用共享文件夹
                         [runtime]
disableSharedFolders     .vmx 文件的路径      禁用来宾系统中的共享文件夹
                         [runtime]
listProcessesInGuest     .vmx 文件的路径      列出来宾操作系统中正在运行的进程
killProcessInGuest       .vmx 文件的路径      在来宾操作系统中终止进程
                         进程号
deleteFileInGuest        .vmx 文件的路径      删除来宾操作系统中的文件
                         Path in guest
createDirectoryInGuest   .vmx 文件的路径      在来宾操作系统中创建目录
                         Directory path in guest
deleteDirectoryInGuest   .vmx 文件的路径      删除来宾操作系统中的目录
                         Directory path in guest
CreateTempfileInGuest    .vmx 文件的路径      在来宾操作系统中创建临时文件
listDirectoryInGuest     .vmx 文件的路径      在来宾操作系统中列出一个目录
                         Directory path in guest
CopyFileFromHostToGuest  .vmx 文件的路径      将文件从主机操作系统复制到来宾操作系统
                         Path on host
                         Path in guest
CopyFileFromGuestToHost  .vmx 文件的路径      将文件从来宾操作系统复制到主机操作系统
                         Path in guest
                         Path on host
renameFileInGuest        .vmx 文件的路径      在来宾操作系统中重命名文件
                         Original name
                         New name
typeKeystrokesInGuest    .vmx 文件的路径      在来宾操作系统中键入击键
                         keystroke string
connectNamedDevice       .vmx 文件的路径      连接来宾操作系统中的命名设备
                         device name
disconnectNamedDevice    .vmx 文件的路径      断开来宾操作系统中的命名设备
                         device name
captureScreen            .vmx 文件的路径      将虚拟机的屏幕捕获到本地文件
                         Path on host
writeVariable            .vmx 文件的路径      在VM状态下写入一个变量
                         [runtimeConfig|guestEnv|guestVar]
                         variable name
                         variable value
readVariable             .vmx 文件的路径      读取处于VM状态的变量
                         [runtimeConfig|guestEnv|guestVar]
                         variable name
getGuestIPAddress        .vmx 文件的路径      获取来宾的IP地址
                         [-wait]

常规命令选项         参数               描述
----------------         ----------           -----------
list                                           列出所有运行的虚拟机。 
upgradevm                .vmx 文件的路径      将虚拟机升级到当前虚拟硬件版本
installTools             .vmx 文件的路径      安装 VMware Tools in Guest
checkToolsState          .vmx 文件的路径      检查客户机中的 VMware Tools 的状态。
            可能的状态为 unknown、installed和running
deleteVM                 .vmx 文件的路径      删除虚拟机
clone                    .vmx 文件的路径      创建 VM 的副本
                         目标 .vmx 文件的路径
                         full（完全克隆）|linked（链接克隆）
                         [-snapshot=克隆的快照名称 if linked时]
                         [-cloneName=名称]

VM模板命令        参数               描述
---------------------    ----------           -----------
downloadPhotonVM         新虚拟机的路径       下载光子虚拟机
```

### 示例

```bash
# 启动虚拟机
vmrun -T ws start "c:\myVMs\myVM.vmx"
vmrun -T ws stop "c:\myVMs\myVM.vmx"

# 克隆虚拟机
/e/rjcode/VMware/vmrun.exe -T ws clone "/e/vm/centos7.vmx" "/e/vm/k8s/master-130/master-130.vmx"  full -cloneName=master-130

# 在 Windows 主机上使用 Workstation 在虚拟机中运行程序
vmrun -T ws -gu guestUser -gp guestPassword runProgramInGuest "c:\myVMs\myVM.vmx" "c:\Program Files\myProgram.exe"

# 在Windows上登录虚拟机，并执行虚拟机脚本
E:\rjcode\VMware\vmrun.exe -T ws -gu root -gp 123456a runProgramInGuest "e:\vm\k8s\node-131\node-131.vmx" /bin/bash /root/first.sh 131 node-131


# 创建虚拟机的快照
vmrun -T ws snapshot "c:\myVMs\myVM.vmx" mySnapshot

# 获取快照列表
vmrun -T ws listSnapshots "c:\myVMs\myVM.vmx"

# 还原快照
vmrun -T ws revertToSnapshot "c:\myVMs\myVM.vmx" mySnapshot

# 删除快照
vmrun -T ws deleteSnapshot "c:\myVMs\myVM.vmx" mySnapshot

# 启用工作站共享文件夹
vmrun -T ws enableSharedFolders "c:\myVMs\myVM.vmx"
```

