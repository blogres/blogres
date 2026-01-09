---
icon: redis
title: 配置Redis工具类
category: 
- 中间件
date: 2022-06-03
tag:
- Redis
---

配置Redis工具类

<!-- more -->

# Redis配置RedisTemplate以及编写工具类

[🏍 🏍 gitee源码](https://gitee.com/cps007/spring-boot-model)

## 依赖

```xml
 <dependency>
           <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>io.lettuce</groupId>
                    <artifactId>lettuce-core</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
        </dependency>
```

## RedisConfig 配置

`application.yml` 配置允许依赖循环引用(==看自己情况而定==)

```yaml
spring:
  main:
   # 允许 bean 定义覆盖
   allow-bean-definition-overriding: true
   # 允许依赖循环引用
   allow-circular-references: true
   
  redis:
    open: false  # 是否开启redis缓存  true开启   false关闭
    database: 0
    host: 192.168.100.4
    port: 6491
    password:    # 密码（默认为空）
    timeout: 6000ms  # 连接超时时长（毫秒）
    jedis:
      pool:
        max-active: 1000  # 连接池最大连接数（使用负值表示没有限制）
        max-wait: -1ms      # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-idle: 10      # 连接池中的最大空闲连接
        min-idle: 5       # 连接池中的最小空闲连接

```

[🚀🚀FastJson2JsonRedisSerializer](https://gitee.com/cps007/spring-boot-model/blob/dev/src/main/java/cn/springboot/model/base/config/FastJson2JsonRedisSerializer.java)

[🚀🚀RedisConfig](https://gitee.com/cps007/spring-boot-model/blob/dev/src/main/java/cn/springboot/model/base/config/RedisConfig.java)

```java
package cn.springboot.model.service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author jf
 * @version 1.0
 * @Description 描述
 * @date 2022/06/02 20:21
 */
@Configuration
public class RedisConfig {

    /**
     * redis:V -> json序列化配置
     * ----> JDK 序列化方式 （默认） JdkSerializationRedisSerializer
     * ----> String 序列化方式 StringRedisSerializer
     * ----> JSON 序列化方式 Jackson2JsonRedisSerializer、GenericJackson2JsonRedisSerializer
     * ----> XML 序列化方式 OxmSerializer
     */
    @Bean(name = "redisTemplate")
    @SuppressWarnings("all")
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

//        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
//        ObjectMapper mapper = new ObjectMapper();
//        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
//        mapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
//        jackson2JsonRedisSerializer.setObjectMapper(mapper);
////////////////////////////////////////////////////////////////
//        GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        FastJson2JsonRedisSerializer fastJson2JsonRedisSerializer = new FastJson2JsonRedisSerializer(Object.class);

        // redis:K 的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        //key采用String的序列方式
        redisTemplate.setKeySerializer(stringRedisSerializer);
        //hash的key采用String的序列方式
        redisTemplate.setHashKeySerializer(stringRedisSerializer);

        //value的序列化方式采用Jackson
        redisTemplate.setValueSerializer(fastJson2JsonRedisSerializer);
        //hash的value采用jackson
        redisTemplate.setHashValueSerializer(fastJson2JsonRedisSerializer);

        redisTemplate.afterPropertiesSet();

        return redisTemplate;
    }

    @Bean //(name = "stringRedisTemplate")
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }

}


```

## RedisUtils 工具类

主要代码，具体请看[🏍 gitee源码🚀](https://gitee.com/cps007/spring-boot-model/blob/dev/src/main/java/cn/springboot/model/service/utils/RedisUtils.java)

```java

/**
 * Redis工具类:<br/>
 * 常用类型:Value,List,Set,Hash,ZSet. <br/>
 * 其他类型:Cluster,Geo,HyperLogLog.<br/>
 * StringRedisTemplate:可操作 Value,Hash.<br/>
 * RedisTemplate:可操作 Value,Hash,List,Set,ZSet.<br/>
 * 实例： new RedisUtils().new String2().set("test", "00111");
 *
 * @author jf
 * @version 1.0
 */
@Component("redisUtils")
@SuppressWarnings({"unchecked", "all"})
public class RedisUtils {

    @Resource
    @Qualifier("redisTemplate")
    protected RedisTemplate<java.lang.String, Object> redisTemplate;

    @Resource
    protected StringRedisTemplate stringRedisTemplate;

    protected final long NOT_EXPIRE = -1;

    public RedisUtils() {
    }

    public ValueOperations<java.lang.String, java.lang.String> getValueOperations() {
        return stringRedisTemplate.opsForValue();
    }

    public HashOperations<java.lang.String, java.lang.String, Object> getHashOperations() {
        return stringRedisTemplate.opsForHash();
    }

    public ListOperations<java.lang.String, Object> getListOperations() {
        return redisTemplate.opsForList();
    }

    public SetOperations<java.lang.String, Object> getSetOperations() {
        return redisTemplate.opsForSet();
    }

    public ZSetOperations<java.lang.String, Object> getZSetOperations() {
        return redisTemplate.opsForZSet();
    }

    public final Common common = new Common();
    public final String string = new String();
    public final Hash hash = new Hash();
    public final List list = new List();
    public final Set set = new Set();
    public final ZSet zSet = new ZSet();

    /**
     * 随机数 55-68 秒
     * <p>
     * autoSeconds()*50=50分钟，*60=1小时，*60*2=2小时，*60*24=1天，*60*24*5=5天
     *
     * @return long
     */
    public long autoSeconds() {
        return ((int) (Math.random() * 14) + 56);
    }

    public class Common {}
    public class String {}
    public class Hash {}
    public class List {}
    public class Set {}
    public class ZSet {}
}

```

使用例子 [实现基于 session+redis 的防重复提交](https://blogres.github.io/java/PreventDuplicateSubmissions.html)

```java
@Aspect
@Component
public class SubmitAspect {

    @Autowired
    private RedisUtils redisUtils;
    
    @Around("submitPointCut()")
    public Object interceptor(ProceedingJoinPoint joinPoint) throws Throwable {
     MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Submit submit = method.getAnnotation(Submit.class);
        
  //读取缓存
            if (redisUtils.string.get(key) != null) {
                Long expire = redisUtils.common.getExpire(key);
                String message = GlobalExceptionEnum.REPEAT_SUBMIT.getMessage();
                throw new GlobalException(GlobalExceptionEnum.REPEAT_SUBMIT.getCode(), message + "，请" + expire + "秒后重试！");
            }
            // 如果是第一次请求,就将key存入缓存中
            redisUtils.string.set(key, key, submit.lockTime());
        return joinPoint.proceed();    
 }
}
```

查看redis记录

`prefix:D6D13DE0091DEC607E2F9DBE364490A8:/dev:getStuById:1`
