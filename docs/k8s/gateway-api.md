---
icon: /icons/k8s/k8s_16x16.png
title: K8s GatewayAPI
category: 
- kubernetes
date: 2026-03-24
order: 8
tag:
- Linux
- k8s
---

ingress-nginx 于 2026.3月Ingress退休，使用GatewayAPI替代

<!-- more -->

# GatewayAPI

## 资源模型

Gateway API 具有四种稳定的 API 类别：

  - **GatewayClass：** 定义一组具有配置相同的网关，由实现该类的控制器管理。
  - **Gateway：** 定义流量处理基础设施（例如云负载均衡器）的一个实例。
  - **HTTPRoute：** 定义特定于 HTTP 的规则，用于将流量从 Gateway 监听器映射到后端网络端点的某种呈现。这些端点通常表示为 Service。
  - **GRPCRoute：** 定义特定于 gRPC 的规则，同↑↑↑↑*HTTPRoute*。

![](https://kubernetes.io/docs/images/gateway-kind-relationships.svg)

### GatewayClass

Gateway 可以由不同的控制器实现，通常具有不同的配置。 Gateway 必须引用某 GatewayClass，而后者中包含实现该类的控制器的名称。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

此示例中，一个实现了 Gateway API 的控制器被配置为管理某些 GatewayClass 对象，这些对象的控制器名为 `example.com/gateway-controller`。归属于此类的 Gateway 对象将由此实现的控制器来管理。


### Gateway

Gateway 用来描述流量处理基础设施的一个实例。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-namespace
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    hostname: "www.example.com"
    allowedRoutes:
      namespaces:
        from: Same
```

在此示例中，流量处理基础设施的实例被编程为监听 80 端口上的 HTTP 流量。由于未指定 addresses 字段，因此对应实现的控制器负责将地址或主机名设置到 Gateway 之上。该地址用作网络端点，用于处理路由中定义的后端网络端点的流量。

### HTTPRoute

HTTPRoute 类别指定从 Gateway 监听器到后端网络端点的 HTTP 请求的路由行为。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

如果 Host: 的标头设置为 `www.example.com` 且请求路径指定为 `/login`，将被路由到 Service `example-svc` 的 8080 端口


### GRPCRoute

GRPCRoute 类别给出将 gRPC 请求从 Gateway 监听器转发到后端网络端点的路由行为。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - backendRefs:
    - name: example-svc
      port: 50051

```

来自 Gateway `example-gateway` 且主机设置为 `svc.example.com` 的 gRPC 流量将被定向到同一名字空间中 `example-svc` 服务的 50051 端口上。

GRPCRoute 允许匹配特定的 gRPC 服务，如下所示：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: example-grpcroute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "svc.example.com"
  rules:
  - matches:
    - method:
        service: com.example
        method: Login
    backendRefs:
    - name: foo-svc
      port: 50051
```

GRPCRoute 将匹配发往 `svc.example.com` 的所有流量，并应用其路由规则将流量转发到正确的后端。由于仅指定了一个匹配条件，只有发往 `svc.example.com` 的 `com.example.User.Login` 方法请求会被转发。其他请求方法的 RPC 调用都不会被此路由匹配。

### 请求数据流

![](https://kubernetes.io/docs/images/gateway-request-flow.svg)

在此示例中，实现为反向代理的 Gateway 的请求数据流如下：

- 1.客户端开始准备 URL 为 `http://www.example.com` 的 HTTP 请求。
- 2.客户端的 DNS 解析器查询目标名称并了解与 Gateway 关联的一个或多个 IP 地址的映射。
- 3.客户端向 Gateway IP 地址发送请求；反向代理接收 HTTP 请求并使用 Host: 标头来匹配基于 Gateway 和附加的 HTTPRoute 所获得的配置。
- 4.可选的，反向代理可以根据 HTTPRoute 的匹配规则进行请求头和（或）路径匹配。
- 5.可选地，反向代理可以修改请求；例如，根据 HTTPRoute 的过滤规则添加或删除标头。
- 6.最后，反向代理将请求转发到一个或多个后端
