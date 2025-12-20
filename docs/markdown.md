---
icon: edit
title: 测试md
category: 
- Java
# headerDepth: 5
date: 2020-01-01
sticky: true
star: true
tag:
- Java
sidebar: false
---

摘要生成位置，66666666

<!-- more -->

::: details 内容目录
[[toc]]
:::

# 测试md h1

## 基础概 h2

### Java 语言 h3

#### 有哪些特 h4

##### 有哪些特 h5

###### 有哪些特 h6

## 视频

引入B站视频

<BiliBili bvid="BV1SN4y1u7sV" />

<VidStack src="/music/chenchusheng-ymyrgsn.mp3" title="陈楚生-有没有人告诉你" />

---

## 代码折叠

::: details 点击查看代码

```js
console.log('你好，VuePress！')
```

:::

## 插入PDF文件

```text
<PDF url="/java/pdf/date.pdf" :height="420" />
<PDF url="https://topjfk.oss-cn-chengdu.aliyuncs.com/docker/01.为什么要学习.pdf" />
```

<PDF url="https://topjfk.oss-cn-chengdu.aliyuncs.com/docker/01.为什么要学习.pdf" />

---

> \<!-- @include: ./test-i.md{6-} -->

<!-- @include: ./test-i.md{6-} -->


> 哪些特哪 *些特* 哪些特哪 **些特** 哪些特
>
> 哪 ==些特== 哪`些特哪些特哪些`特哪些特

重中之重`走着走着`自作主张自增

1. 简单易学；
2. 面向对象（*封装*，*继承*，**多态**）；
3. 平台无关。

- aaa
- 手动阀手动阀
-
  - 了了离开了

## 表格

| 参数   | |
| ------ | ------- |
| name | *xxx*22 |
| age | `22` |
| xx | xx **xx** xx实现==平台无关==性x<br/><code>sdfsdf</code> |
| xx | xx xx xx实现**平台**无关性x |

![](./java/spring-cloud-alibaba-note-basis.assets/true-image-20210601002120191.png)

## 代码块

```yaml
spring:
  profiles:
    # prod、 `dev`、test
    active: dev
  cloud:
    nacos:
      config:
        shared-configs:
          - data-id: application-${spring.profiles.active}
            group: ${spring.profiles.active}
            refresh: true
```

```java
/**
 * @author jf
 * @version 1.0
 * @description 描述
 * @date 2022/07/05 15:46
 */
@Configuration
public class FeignConfig {

    @Bean("requestInterceptor")
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
          ...
        };
    }
}

```
