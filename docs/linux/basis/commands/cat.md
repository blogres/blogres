---
title: cat
article: false
timeline: false
---
### cat 显示较少内容

- [返回命令大全列表](../command.md#文件管理)

①、命令名称：

②、英文原意：

③、命令所在路径：

④、执行权限：所有用户

⑤、功能描述：在 Linux 系统下使用 cat 命令进行多个小文件的合并也很方便

⑥、语法：

```shell
cat [选项] [文件名]

-b: #空行不计入行号的统计
-n: #显示行号
-e: #以$字符作为每行的结尾
-t: #显示TAB字符(^I),禁用制表符
```

⑦、使用实例

```shell
# 合并文件
[root@admin home]# cat /data/users_* > users.sql

[root@admin home]# cat demo.txt
sdfsdfsdf

1354354

34sdr23424sdfs

[root@admin home]# cat -n demo.txt
     1  sdfsdfsdf
     2
     3  1354354
     4
     5  34sdr23424sdfs
     6
[root@admin home]# cat -b demo.txt
     1  sdfsdfsdf

     2  1354354

     3  34sdr23424sdfs

[root@admin home]# cat -T demo.txt
sdfsdfsdf

1354354

34sdr23424sdfs

```

```shell
# 替换全部内容
cat -s <<EOF > /home/test/k8s.conf
vm.swappiness=0
EOF

# 追加内容
cat -s <<EOF >> /home/test/k8s.conf
vm.swappiness=0
EOF
```

⑧、帮助信息

```shell
# 帮助信息
$ cat --h
Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

With no FILE, or when FILE is -, read standard input.

  -A, --show-all           equivalent to -vET
  -b, --number-nonblank    number nonempty output lines, overrides -n
  -e                       equivalent to -vE
  -E, --show-ends          display $ at end of each line
  -n, --number             number all output lines
  -s, --squeeze-blank      suppress repeated empty output lines
  -t                       equivalent to -vT
  -T, --show-tabs          display TAB characters as ^I
  -u                       (ignored)
  -v, --show-nonprinting   use ^ and M- notation, except for LFD and TAB
      --help     display this help and exit
      --version  output version information and exit

Examples:
  cat f - g  Output f's contents, then standard input, then g's contents.
  cat        Copy standard input to standard output.

GNU coreutils online help: <http://www.gnu.org/software/coreutils/>
Full documentation at: <http://www.gnu.org/software/coreutils/cat>
or available locally via: info '(coreutils) cat invocation'
```
