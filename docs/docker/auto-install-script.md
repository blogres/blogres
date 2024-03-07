---
icon: docker1
title: 一键安装docker脚本
category: 
- Docker
headerDepth: 5
date: 2022-05-31
order: 1
tag:
- docker
- dockerfile
---

使用脚本一键安装 Docker

<!-- more -->

`sudo sh install-docker.sh`

## CentOS

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


## Debian

```shell
#!/bin/bash

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
  apt-get -y install docker-ce docker-ce-cli containerd.io
  echo -e "\n"
}


uninstall(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 准备卸载旧版本"
apt-get purge docker-ce docker-ce-cli containerd.io docker-compose-plugin
apt-get remove docker docker-engine docker.io
echo -e "\n"
}

install_tool(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 安装依赖 ..."
  apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common lsb-release
  echo -e "\n"

}


daemon_reload(){
echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 设置镜像加速 ..."
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://04eo9xup.mirror.aliyuncs.com",
    "https://098cc8006500f4db0f2fc01937bbce40.mirror.swr.myhuaweicloud.com"
  ]
}
EOF

echo -e "----> 写入文件[/etc/docker/daemon.json] 成功！\n等待重新加载本地文件..."
systemctl daemon-reload
sleep 5
echo "----> 重新加载完成。"
echo -e "\n"
}

huawei_install(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> 华为源 配置&安装"
  install_tool
##########信任Docker的GPG公钥:
mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.huaweicloud.com/docker-ce/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

##########添加软件仓库:设置 稳定 存储库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://repo.huaweicloud.com/docker-ce/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
sleep 8;
echo "----> 查看版本 ..."
apt-cache madison docker-ce
sleep 8;

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
  usermod -aG docker jf123
  docker images
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n"

}


main(){
  echo -e "\n$(date +%Y-%m-%d,%H:%M:%S)\n--> docker 安装"
  uninstall
  huawei_install
  get_v
  sleep 10;
#  kill_s
}


case $1 in
  *)
    main
 ;;
esac

```
