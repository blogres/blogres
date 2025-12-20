---
title: split
article: false
timeline: false
---
### split 文件切割

- [返回命令大全列表](../command.md#文件管理)

①、命令名称：

②、英文原意：

③、命令所在路径：

④、执行权限：所有用户

⑤、功能描述：在 Linux 系统下使用 split 命令进行大文件切割很方便

⑥、语法：

```shell
-a: #指定输出文件名的后缀长度(默认为2个:aa,ab...)
-d: #指定输出文件名的后缀用数字代替
-l: #行数分割模式(指定每多少行切成一个小文件;默认行数是1000行)
-b: #二进制分割模式(支持单位:k/m)
-C: #文件大小分割模式(切割时尽量维持每行的完整性)

split [-a] [-d] [-l <行数>] [-b <字节>] [-C <字节>] [要切割的文件] [输出文件名]
```

⑦、使用实例

```shell
# 行切割文件
$ split -l 300000 users.sql /data/users_

# 使用数字后缀
$ split -d -l 300000 users.sql /data/users_

# 按字节大小分割
$ split -d -b 100m users.sql /data/users_
```

⑧、帮助信息

```shell
# 帮助信息
$ split --help
Usage: split [OPTION]... [FILE [PREFIX]]
Output pieces of FILE to PREFIXaa, PREFIXab, ...;
default size is 1000 lines, and default PREFIX is 'x'.

With no FILE, or when FILE is -, read standard input.

Mandatory arguments to long options are mandatory for short options too.
  -a, --suffix-length=N   generate suffixes of length N (default 2)            后缀名称的长度(默认为2)
      --additional-suffix=SUFFIX  append an additional SUFFIX to file names
  -b, --bytes=SIZE        put SIZE bytes per output file                       每个输出文件的字节大小
  -C, --line-bytes=SIZE   put at most SIZE bytes of records per output file    每个输出文件的最大字节大小
  -d                      use numeric suffixes starting at 0, not alphabetic   使用数字后缀代替字母后缀
      --numeric-suffixes[=FROM]  same as -d, but allow setting the start value
  -e, --elide-empty-files  do not generate empty output files with '-n'        不产生空的输出文件
      --filter=COMMAND    write to shell COMMAND; file name is $FILE           写入到shell命令行
  -l, --lines=NUMBER      put NUMBER lines/records per output file             设定每个输出文件的行数
  -n, --number=CHUNKS     generate CHUNKS output files; see explanation below  产生chunks文件
  -t, --separator=SEP     use SEP instead of newline as the record separator;  使用新字符分割
                            '\0' (zero) specifies the NUL character
  -u, --unbuffered        immediately copy input to output with '-n r/...'     无需缓存
      --verbose           print a diagnostic just before each                  显示分割进度
                            output file is opened
      --help     display this help and exit                                    显示帮助信息
      --version  output version information and exit                           显示版本信息

The SIZE argument is an integer and optional unit (example: 10K is 10*1024).
Units are K,M,G,T,P,E,Z,Y (powers of 1024) or KB,MB,... (powers of 1000).

CHUNKS may be:
  N       split into N files based on size of input
  K/N     output Kth of N to stdout
  l/N     split into N files without splitting lines/records
  l/K/N   output Kth of N to stdout without splitting lines/records
  r/N     like 'l' but use round robin distribution
  r/K/N   likewise but only output Kth of N to stdout

GNU coreutils online help: <http://www.gnu.org/software/coreutils/>
Full documentation at: <http://www.gnu.org/software/coreutils/split>
or available locally via: info '(coreutils) split invocation'
```
