---
icon: java
title: session+redis防止重复提交
category: 
- Java
headerDepth: 5
date: 2022-06-08
---

# 实现基于 session+redis 的防止重复提交

<!-- more -->

[🏍 gitee源码仓库🚀🚀🚀🚀](https://gitee.com/cps007/spring-boot-model)

## 定义注解

[Submit注解接口](https://gitee.com/cps007/spring-boot-model/blob/dev/src/main/java/cn/springboot/model/base/annotation/Submit.java)

```java
package cn.springboot.model.base.annotation;

import java.lang.annotation.*;

/**
 * 自定义注解防止表单重复提交
 *
 * @author jf
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Submit {
    /**
     * 设置请求次数上限，在于 triggerTime() 内
     *
     * @return
     */
    int lockCount() default 4;

    /**
     * 锁定请求时间<p/>
     * 单位:分钟
     *
     * @return
     */
    long lockTime() default 60;

    /**
     * 触发重复提交时间
     *
     * @return
     */
    long triggerTime() default 6;

}

```

## 实现 aop 切面

[实现 aop 切面源码](https://gitee.com/cps007/spring-boot-model/blob/dev/src/main/java/cn/springboot/model/service/aspectj/SubmitAspect.java)

```java
package cn.springboot.model.service.aspectj;

import cn.springboot.model.base.annotation.Submit;
import cn.springboot.model.base.enums.GlobalExceptionEnum;
import cn.springboot.model.base.exception.GlobalException;
import cn.springboot.model.base.utils.IPUtils;
import cn.springboot.model.base.utils.StringUtils;
import cn.springboot.model.service.utils.RedisUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * 重复提交aop切面
 *
 * @author jf
 */
@Aspect
@Component
public class SubmitAspect {
    /**
     * 重复提交缓存前缀
     */
    private static final String PREFIX = "submit_prefix:";
    /**
     * 锁定计数键
     */
    private static final String LOCK_COUNT_KEY = "submit_lock_count:";
    /**
     * 锁定恶意请求前缀
     */
    private static final String LOCK = "submit_lock:";

    @Autowired
    private RedisUtils redisUtils;

    @Pointcut("execution(public * *(..)) && @annotation(cn.springboot.model.base.annotation.Submit)")
    public void submitPointCut() {
    }

    @Around("submitPointCut()")
    public Object interceptor(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String sessionId = RequestContextHolder.getRequestAttributes().getSessionId();
        HttpServletRequest request = attributes.getRequest();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Submit submit = method.getAnnotation(Submit.class);

        //设置key: submit_prefix:用户ip-sessionId-Path-method+参数
        String addr = IPUtils.getIpAddr(request);
        String key = PREFIX + addr + "-" + sessionId + "-" + request.getServletPath() + "-" + method.getName() + "-" + getArgs(joinPoint);
        String submit_lock_count_key = key.replaceAll(PREFIX, LOCK_COUNT_KEY);
        String submit_lock_key = key.replaceAll(PREFIX, LOCK);

        Long expire = redisUtils.common.getExpire(key);
        String message = GlobalExceptionEnum.REPEAT_SUBMIT.getMessage();
        String lock_message = GlobalExceptionEnum.MALICE_REPEAT_SUBMIT.getMessage();

        if (redisUtils.common.hasKey(submit_lock_key)) {
            retrunLock(submit_lock_key, lock_message);
        }

        //读取缓存
        if (redisUtils.value.get(key) != null) {
            // 触发请求累加 submit_lock_count
            Integer count = redisUtils.value.get(submit_lock_count_key);
            redisUtils.value.set(submit_lock_count_key, count + 1, submit.triggerTime());
            //记录到达 lockCount,锁定恶意请求
            if (count >= submit.lockCount()) {
                redisUtils.value.set(submit_lock_key, "锁定恶意请求", submit.lockTime(), TimeUnit.MINUTES);
                retrunLock(submit_lock_key, lock_message);
            }
            throw new GlobalException(GlobalExceptionEnum.REPEAT_SUBMIT.getCode(), message + "，请" + expire + "秒后重试！");
        }
        // 如果是第一次请求,就将key存入缓存中
        redisUtils.value.set(key, "第一次请求", submit.triggerTime());
        //请求次数=1
        redisUtils.value.set(submit_lock_count_key, 1, submit.triggerTime());
        return joinPoint.proceed();
    }

    private void retrunLock(String key, String message) {
        int expire = Integer.parseInt(String.valueOf(redisUtils.common.getExpire(key))) / 60;
        throw new GlobalException(GlobalExceptionEnum.MALICE_REPEAT_SUBMIT.getCode(), message + "，请" + expire + "分钟后重试！");
    }

    private String getArgs(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        boolean argsStatus = StringUtils.isNotNull(args);

        if (argsStatus) {
            StringBuilder data = new StringBuilder();
            for (Object o : Arrays.stream(args).toArray()) {
                data.append(o);
            }
            return data.toString();
        }
        return "";
    }

}

```
