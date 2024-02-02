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

```sh
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
