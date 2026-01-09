---
icon: java
title: JDK安装与配置
category: 
- 开发工具
date: 2020-01-21
tag:
- JDK
---

JDK安装与配置

<!-- more -->

# jdk安装与配置

## 一、环境准备

前提是先把网络ip配置好

### 1、下载JDK

官网下载地址：

- [jdk各个版本下载](https://www.oracle.com/java/technologies/downloads/)
- [jdk各个版本档案](https://www.oracle.com/java/technologies/downloads/archive/)
- [jdk各版本下载-百度网盘](https://pan.baidu.com/s/17pkHcX7YrssnEVctveHbHQ) 提取码：1234
- [生命周期图](https://www.oracle.com/java/technologies/java-se-support-roadmap.html#Oracle%20JDK%20and%20OpenJDK%20Builds%20from%20Oracle)


**Oracle Java SE Support Roadmap\*†**

| Release	| GA Date	| Premier Support Until	| Extended Support Until	| Sustaining Support|
| -------------------------------- | --------------------------- | ------------------------------- | ---------------------- | ------------------ |
| **8 (LTS)**\***                  | March 2014                  | March 2022                      | December 2030*****     | Indefinite         |
| 9 - 10 (non-LTS)                 | September 2017 - March 2018 | March 2018 - September 2018     | Not Available          | Indefinite         |
| 11 (LTS)                         | September 2018              | September 2023                  | January 2032*****      | Indefinite         |
| 12 - 16 (non-LTS)                | March 2019 - March 2021     | September 2019 - September 2021 | Not Available          | Indefinite         |
| **17 (LTS)**                     | September 2021              | September 2026****              | September 2029****     | Indefinite         |
| 18 - 20 (non-LTS)                | March 2022 - March 2023     | September 2022 - September 2023 | Not Available          | Indefinite         |
| **21 (LTS)**                     | September 2023              | September 2028****              | September 2031****     | Indefinite         |
| 22 (non-LTS)                     | March 2024                  | September 2024                  | Not Available          | Indefinite         |
| 23 (non-LTS)                     | September 2024              | March 2025                      | Not Available          | Indefinite         |
| 24 (non-LTS)                     | March 2025                  | September 2025                  | Not Available          | Indefinite         |
| **25 (LTS)**                     | September 2025              | September 2030****              | September 2033****     | Indefinite         |
| 26 (non-LTS)***                  | March 2026                  | September 2026                  | Not Available          | Indefinite         |
| 27 (non-LTS)***                  | September 2026              | March 2027                      | Not Available          | Indefinite         |



### 2、下载 SSH Secure File Transfer Client 连接工具 或 MobaXterm

A:网上随便兽兽道首；

## 二、解压安装

### 1、使用工具wind10-->Linux传输文件

file--connect---hostName（linux的ip）---user name（系统用户）---prot（端口：默认）--authentication（选择password）---点击connect后----输入密码

选中点击鼠标右键---Upload----->

### 2、contos删除自带的jdk

```shell
//检查jdk
rpm -qa | grep java

rpm 　　管理套件    
-qa 　　使用询问模式，查询所有套件
grep　　查找文件里符合条件的字符串
java 　　查找包含java字符串的文件
```

删除

```shell
只删除这几个
java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64
java-1.8.0-openjdk-1.8.0.102-4.b14.el7.x86_64
java-1.8.0-openjdk-headless-1.8.0.102-4.b14.el7.x86_64
java-1.7.0-openjdk-headless-1.7.0.111-2.6.7.8.el7.x86_64

//删除命令
rpm -e --nodeps java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64

rpm 　　　　管理套件  
-e　　　　　删除指定的套件
--nodeps　　不验证套件档的相互关联性

//检查
java -version
```

### 3.Ubuntu卸载jdk

```shell
//查看java安装路径：
 root@hdas:/home/kong$ which java
//其他jvm地址：
 /usr/lib/jvm
-----------------------------------
//删除指令：
 sudo apt-get remove openjdk*     在输入openj后可以按Tab键查看提示
```

```shell
root@de:/home/af$ sudo apt-get remove openj
 openjdk-11-jre           openjdk-8-jre-headless
 openjdk-11-jre-headless  openjfx                  
root@de:/home/af$ sudo apt-get remove openjdk*
*****
解压缩后将会空出 583 MB 的空间。
您希望继续执行吗？ [Y/n] y
****
```

### 4、在Linux解压文件

```shell
[root@yu local]$ tar -zxvf 【文件名】【目标路径】 【eclipse】新名称
[root@yu local]$ tar -zxvf 【文件名】【目标路径】 【jdk】新名称
```

```shell
//查看
[root@yu local]$ ll
总用量 48
drwxrwxr-x. 8 root root 4096 12月 12 23:25 eclipse
drwxr-xr-x. 7   10  143 4096 12月 16 2018 jdk
```

## 三、配置环境变量

==jdk11后没有jre==

### 打开文件

> vim /etc/profile
> 按i 开始编辑
> //保存退出：
> 先按 ==esc== > 再按 ==shift+:==  然后输入==wq== > 回车键

jdk>=11

```shell
export JAVA_HOME=/usr/local/java/jdk-17.0.3
export PATH=$PATH:$JAVA_HOME/bin
```

jdk<11

```shell
export JAVA_HOME=/usr/local/java/jdk1.8
export M2_HOME=/usr/local/java/maven-3.8.3
export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin:${JAVA_HOME}/jre/bin:${M2_HOME}/bin

```

### 刷新配置

> source /etc/profile

### 查看java

```java
[root@yu /]# java -version
java version "1.8.0_201"
Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)

//
[root@yu /]# java
用法: java [-options] class [args...]
           (执行类)
   或  java [-options] -jar jarfile [args...]
           (执行 jar 文件)

```

## 四、测试、运行hello world。java 程序

### 创建一个java文件

```shell
[root@yu eclipse]$ touch HelloWorld.java
```

### 编写java代码文件

> vim HelloWorld.java

内容如下

```java
public class HelloWorld {
        public static void main(String[] agrs){
                System.out.println("Hello World");
        }
}
```

### 编译java文件

```shell
[root@yu eclipse]$ javac HelloWorld.java
```

### 运行文件

```shell
[root@yu eclipse]$ java HelloWorld

//运行结果
Hello World
```

## docker-centos7 安装jdk、构建jar包镜像

[🚀地址🚀](https://blog.csdn.net/qq_42476834/article/details/125121395)
