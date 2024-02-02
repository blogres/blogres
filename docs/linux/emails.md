---
icon: linux
title: Linux发送邮件
category: 
- Linux
headerDepth: 5
date: 2023-03-16
tag:
- Email
---

Linux发送邮件

<!-- more -->


# Linux发送邮件


## 使用 mail 命令

mail 是 mailutils（在 Debian 上）和 mailx（在 RedHat 上）软件包的一部分，用于在命令行上处理邮件。

```shell
sudo apt-get install mailutils
yum install mailx
```

现在可以使用 mail 命令发送带有附件的电子邮件，示例如下。

```shell
echo "入门小站" | mail -s "入门小站-测试" rumenz@example.com -A rumenz.zip
```

在上面的命令中，选项

- -s - 指定邮件主题。
- -A - 用于附加文件。

你也可以按照以下方式发送现有消息：

```shell
mail -s "入门小站-测试" -t rumenz@example.com -A rumenz.zip < message.txt
```

## 使用 mailx 命令

mailx 更像 mutt 命令，它也是 mailutils（在 Debian 上）软件包的一部分。

```shell
sudo apt-get install mailutils
yum install mailx
```

现在可以使用 mailx 命令从命令行发送带有附件的邮件。

```shell
echo "入门小站" | mailx -s "入门小站-测试" -a rumenz.zip rumenz@example.com
```

## 使用 mutt 命令

mutt 是一款流行的轻量级 Linux 命令行邮件客户端。如果你的系统上没有它，请输入以下命令安装它：

```shell
sudo apt-get install mutt
yum install mutt
```

你可以使用以下 mutt 命令发送带有附件的电子邮件。

```shell
echo "入门小站" | mutt -s "入门小站-测试" -a rumenz.zip rumenz@example.com
```

其中选项:

- -s - 表示邮件主题。
- -a - 标识附件。

## 使用 mpack 命令

mpack 将指定文件编码为一个或多个 MIME 消息，并将该消息发送到一个或多个接收者，
或将其写入命名文件或文件集，或将其发布到一组新闻组。

```shell
sudo apt-get install mpack
yum install mpack
```

要发送带有附件的消息，请运行以下命令。

```shell
mpack -s "入门小站" file rumenz@example.com
```

[参考地址](https://mp.weixin.qq.com/s/bIcNFHHs6-10cW7O6bg4_A)


