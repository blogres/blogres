---
title: scp
article: false
timeline: false
---
### scp

- [返回命令大全列表](../command.md#文件管理)

①、命令名称：securecopy

②、英文原意：securecopy

③、命令所在路径：

④、执行权限：所有用户

⑤、功能描述：scp命令用于Linux之间复制文件和目录。scp是securecopy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。scp是加密的，rcp是不加密的，scp是rcp的加强版。


⑥、语法：

```shell
scp [选项] [源文件] [目标路径]
```

- [选项]：用于指定 scp 命令的行为，例如递归复制、保留文件属性等。
- [源文件]：要复制的文件或目录的路径。
- [目标路径]：文件或目录要复制到的目标路径。


*常用选项：*

- -r：递归复制整个目录。
- -P：大写P指定远程主机的 SSH 端口号（默认是 22）。
- -p：保留文件的修改时间、访问时间和权限。
- -v：显示详细的调试信息，有助于排查问题。
- -C：启用压缩，可以加快传输速度。

*其它选项说明*

- -1： 强制scp命令使用协议ssh1
- -2： 强制scp命令使用协议ssh2
- -4： 强制scp命令只使用IPv4寻址
- -6： 强制scp命令只使用IPv6寻址
- -B： 使用批处理模式（传输过程中不询问传输口令或短语）
- -q： 不显示传输进度条。
- -c cipher： 以cipher将数据传输进行加密，这个选项将直接传递给ssh。
- -F ssh_config： 指定一个替代的ssh配置文件，此参数直接传递给ssh。
- -i identity_file： 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。
- -l limit： 限定用户所能使用的带宽，以Kbit/s为单位。
- -o ssh_option： 如果习惯于使用ssh_config(5)中的参数传递方式，
- -S program： 指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项


**应用实例**

**从本地复制到远程端**

```shell
scp /home/software/1.mp3 root@www.a.com:/home/root/software/ 
scp /home/software/1.mp3 root@www.a.com:/home/root/software/10.mp3 
scp /home/software/1.mp3 www.a.com:/home/root/software/ 
scp /home/software/1.mp3 www.a.com:/home/root/software/11.mp3 
scp /home/software/rocektmq-3.2.6.tar.gz 192.168.1.2:/home/root/software/
```

- 第 1, 2 个指定了用户名，命令执行后需要再输入密码；
- 第 3, 4 个没有指定用户名，命令执行后需要输入用户名和密码。
- *可以配置SSH免密，杜绝每次都需要输入密码*



**从远程主机复制文件到本地**


```shell
scp root@192.168.1.2:/home/software/example.txt .
```

**递归复制目录**

将本地的 my_directory 目录复制到远程主机的 /home/user/ 目录下：

```shell
scp -r my_directory user@remote_host:/home/user/
```

**指定端口号**

如果远程主机的 SSH 服务运行在非默认端口（例如 2222），使用 -P 选项指定端口号：

```shell
scp -P 2222 example.txt user@remote_host:/home/user/
```

**保留文件属性**

使用 -p 选项保留文件的修改时间、访问时间和权限：

```shell
scp -p example.txt user@remote_host:/home/user/
```

**启用压缩**

对于大文件或网络较慢的情况，可以使用 -C 选项启用压缩，以加快传输速度：

```shell
scp -C large_file.zip user@remote_host:/home/user/
```

