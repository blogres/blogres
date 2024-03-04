---
icon: /icons/k8s/k8s_16x16.png
title: 设置docker-k8s快捷指令
category: 
- kubernetes
headerDepth: 5
date: 2022-05-31
order: 1
tag:
- Linux
- k8s
- alias
---

在Linux、window设置docker-k8s快捷指令

<!-- more -->

# 在Linux、window设置docker、k8s快捷指令

## Linux 端

`vim ~/.bashrc`

```shell
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

```

### k8s：kubectl

```shell
########k8s############
###########k8s-创建与删除
alias k='kubectl'
alias ka='kubectl apply -f' #使用yaml创建apps
alias kd='kubectl delete -f' #删除yaml创建apps
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
alias kgpodw='watch kubectl get pod -n kube-system -o wide' #监控k8s-pod的kube-system进度
###########k8s-pods信息
alias kgpodsallns='kubectl get pods --all-namespaces -o wide' #获取pods所有名称空间
alias kgpodsn='kubectl get pods -o wide -n $1' #查看输入的【可以kgpodsans查看】名称空间信息
alias kgpodsn-k8s='kubectl get pods -n kube-system -o wide' #查看名称空间kube-system的信息
alias kgpodsn-ingressnginx='kubectl get pods -n ingress-nginx -o wide' #查看名称空间ingress-nginx的信息
alias kgpods-node='kubectl get pods -n kube-system -o wide | grep $1' #查看node子节点的pod信息
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

```

### docker

`sudo vim ~/.bashrc` 来设置Linux命令别名

```shell
########docker############

#镜像检索
alias dkse='sudo docker search'      #镜像名称
alias dklogin='sudo docker login'    #登录远程镜像仓库
#推送
alias dkpull='sudo docker pull'      #镜像名称
alias dkcommit='sudo docker commit'  #提交容器为镜像         [-a='作者' -m='备注' 运行时容器ID 新镜像名称]
alias dkb='sudo docker build'        #file文件构建镜像       [-f [DockerFile文件] -t [设置标签]:版本 . ]
alias dktag='sudo docker tag'        #设置镜像为阿里|xx标签  [容器ID [设置标签]:version]
alias dkpush='sudo docker push'      #镜像提交到仓库         [输入设置好的标签:verison]
#镜像列表
alias dki='sudo docker images'       #镜像名称or镜像Id
#镜像删除
alias dkrmi='sudo docker rmi'        #镜像名称or镜像Id
alias dkrmif='sudo docker rmi -f'
#删除所有镜像
alias dkrmia='sudo docker rmi $(docker images -q)'
#容器列表
alias dkps='sudo docker ps'  #在运行的容器
alias dkpsa='sudo docker ps -a'      #全部容器
#启动容器
alias dkstart='sudo docker start'    #容器名称or容器Id
alias dkrestart='sudo docker restart'  #容器名称or容器Id
#停止容器
alias dkstop='sudo docker stop'      #stop 容器名称or容器Id
alias dkkill='sudo docker kill'      #docker kill 容器ID or 容器名
#删除容器
alias dkrm='sudo docker rm'  #docker rm 容器id
#强制删除容器
alias dkrmf='sudo docker rm -f'      #容器ID1  容器ID2 中间空格隔开
alias dkrma='sudo docker rm $(docker ps -a -q)'      #删除所有容器

# 宿主机和容器之间文件拷
#docker cp 容器ID:容器目录   宿主机目录
#docker cp 需要拷贝的文件或者目录  容器ID:容器目录
alias dkcp='sudo docker cp'
#容器日志
alias dklogs='sudo docker logs'      #容器名称/容器id

```

按**shift + ;** 输入wq保存,再输入bash全局使用
使用:

```shell
kong@k:~$ dkse redis
NAME                             DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
redis                            Redis is an open source key-value store that…   9497                [OK]                
bitnami/redis                    Bitnami Redis Docker Image                      181       [OK]

kong@k:~$ dkpull redis
Using default tag: latest
latest: Pulling from library/redis
Status: Downloaded newer image for redis:latest
docker.io/library/redis:latest

kong@k:~$ dki
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
redis               latest              bc8d70f9ef6c        2 weeks ago         105MB

kong@k:~$ dkrmi redis
Untagged: redis:latest
Untagged: redis@sha256:365eddf。。。bcec912973

kong@k:~$ dki
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
```

## windows 端

1、在Windows Powershell 执行 ==echo $PROFILE==

```shell
PS C:\Users\k\Desktop> echo $PROFILE
C:\Users\k\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
PS C:\Users\k\Desktop>
```

编辑：C:\Users\k\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1

```shell
function dkse{docker search}
function dklogin{docker login}
function dkpull{docker pull}     
function dkcommit{docker commit} 
function dkb{docker build}       
function dktag{docker tag}        
function dkpush{docker push}    
function dki{docker images}      
function dkrmi{docker rmi}       
function dkrmif{docker rmi -f}
function dkrmia{docker rmi $(docker images -q)}
function dkps{docker ps}  
function dkpsa{docker ps -a}    
function dkstart{docker start}   
function dkrestart{docker restart} 
function dkstop{docker stop}    
function dkkill{docker kill}   
function dkrm{docker rm} 
function dkrmf{docker rm -f}
function dkrma{docker rm $(docker ps -a -q)}
function dkcp{docker cp}
function dklogs{docker logs}
```

以管理员身份打开Powershell 执行命令: ==Set-ExecutionPolicy RemoteSigned== ，然后重新启动计算机
