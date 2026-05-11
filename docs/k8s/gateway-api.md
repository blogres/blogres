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

## API资源模型

Gateway API 具有四种稳定的 API 类别：

  - **GatewayClass：** 定义一组具有配置相同的网关，由实现该类的控制器管理。
  - **Gateway：** 定义流量处理基础设施（例如云负载均衡器）的一个实例。
  - **Route：**
  - - **HTTPRoute**：定义特定于 HTTP 的路由规则，用于将流量从 Gateway 监听器映射到后端网络端点的某种呈现。这些端点通常表示为 Service。
  - - **GRPCRoute**：定义特定于 GRPC 的路由规则，同↑↑↑↑*HTTPRoute*。
  - - TCPRoute：定义特定于 TCP 的路由规则，同↑↑↑↑。
  - - UDPRoute：定义特定于 UDP 的路由规则，同↑↑↑↑。
  - - TLSRoute：定义特定于 TLS 的路由规则，同↑↑↑↑。

一个 Gateway 对象只能与一个 GatewayClass 相关联；GatewayClass 是负责管理 Gateway 的网关控制器。

各个（多个）路由类别（如 HTTPRoute）可以关联到此 Gateway 对象。Gateway 可以对能够挂接到其 listeners 的路由进行过滤，从而与路由形成双向信任模型。

<img src="./gateway-api.assets/image-20260511145901365.png" alt="image-20260511145901365" style="zoom: 67%;" />

### GatewayClass

Gateway 可以由不同的控制器(GatewayClass)实现。 Gateway 必须引用 GatewayClass，而后者中包含实现该类的控制器的名称(gatewayClassName)。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: aniuger-class
spec:
  controllerName: aniuger.com/gateway-controller
```

实现了 Gateway API 的控制器被配置为管理 GatewayClass 对象，这些对象的控制器名为 `aniuger.com/gateway-controller`。归属于此类的 Gateway 对象将由此实现的控制器来管理。


### Gateway

- 多 Listener 多端口 原生支持
- *ingress 只能监听一个 80/443*
- Gateway 支持：•多个端口；•多协议；•多 TLS 配置；•同一个网关下多个Route。

Gateway 用来描述流量处理基础设施的一个实例。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: aniuger-gateway
  namespace: aniuger-namespace
spec:
  gatewayClassName: aniuger-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    hostname: "www.aniuger.com"
    allowedRoutes:
      namespaces:
        from: Same
```

*from: Same*  仅同一命名空间内的路由可被该网关使用。

在此示例中，流量处理基础设施的实例被编程为监听 80 端口上的 HTTP 流量。由于未指定 addresses 字段，因此对应实现的控制器负责将地址或主机名设置到 Gateway 之上。该地址用作网络端点，用于处理路由中定义的后端网络端点的流量。

### HTTPRoute

HTTPRoute 类别指定从 Gateway 监听器到后端网络端点的 HTTP 请求的路由行为。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: aniuger-httproute
spec:
  parentRefs:
  - name: aniuger-gateway
  hostnames:
  - "www.aniuger.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: aniuger-svc
      port: 8080
```

如果 Host: 的标头设置为 `www.aniuger.com` 且请求路径指定为 `/login`；`http://www.aniuger.com/login` 将被路由到 Service `aniuger-svc` 的 8080 端口


### GRPCRoute

[GRPCRoute 参考文档](https://gateway-api.sigs.k8s.io/reference/spec/#grpcroute)

GRPCRoute 类别给出将 gRPC 请求从 Gateway 监听器转发到**后端服务**的路由行为。

示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: aniuger-grpcroute
spec:
  parentRefs:
  - name: aniuger-gateway
  hostnames:
  - "svc.aniuger.com"
  rules:
  - backendRefs:
    - name: aniuger-svc
      port: 50051
```

来自 Gateway `aniuger-gateway` 且主机设置为 `svc.aniuger.com` 的 gRPC 流量将被定向到同一名字空间中 `aniuger-svc` 服务的 50051 端口上。

GRPCRoute 允许匹配特定的 gRPC 服务（访问特定的后端**接口方法** `com.aniuger.User.Login`），如下：

```yaml {2-5}
  rules:
  - matches:
    - method:
        service: com.aniuger
        method: Login
    backendRefs: 
    - name: aniuger-svc
      port: 50051
```

GRPCRoute 将匹配发往 `svc.aniuger.com` 的所有流量，并应用其路由规则将流量转发到正确的后端。由于仅指定了一个匹配条件，只有发往 `svc.aniuger.com` 的 `com.aniuger.User.Login` 方法请求会被转发。其他请求方法的 RPC 调用都不会被此路由匹配。

### 请求数据流

![image-20260511150133548](./gateway-api.assets/image-20260511150133548.png)

在此示例中，实现为反向代理的 Gateway 的请求数据流如下：

- 1.客户端开始准备 URL 为 `http://www.example.com` 的 HTTP 请求。
- 2.客户端的 DNS 解析器查询目标名称并了解与 Gateway 关联的一个或多个 IP 地址的映射。
- 3.客户端向 Gateway IP 地址发送请求；反向代理接收 HTTP 请求并使用 Host: 标头来匹配基于 Gateway 和附加的 HTTPRoute 所获得的配置。
- 4.可选的，反向代理可以根据 HTTPRoute 的匹配规则进行请求头和（或）路径匹配。
- 5.可选地，反向代理可以修改请求；例如，根据 HTTPRoute 的过滤规则添加或删除标头。
- 6.最后，反向代理将请求转发到一个或多个后端



## Gateway API 控制器选择

| 控制器                      | 内核                 | 优点                               | 场景                   |
| --------------------------- | -------------------- | ---------------------------------- | ---------------------- |
| Envoy Gateway（官方推荐）   | Envoy Proxy          | 性能极高；安全；企业级；社区驱动强 | 生产强负载、平台化使用 |
| Kong Gateway                | Kong + Envoy（可选） | API 网关能力强，插件丰富           | 微服务 API 场景        |
| HAProxy Unified Gateway     | HAProxy              | 性能强、稳定、易部署               | 传统 LB 场景、私有云   |
| Traefik Hub / Traefik Proxy | Traefik              | 部署最简单、支持多源               | 中小团队、轻量场景     |
| Cilium Gateway              | eBPF                 | 低延迟、高吞吐、网络一致性         | 已用 Cilium CNI        |
| GKE Gateway API             | Google LB            | 云托管 LB                          | GKE 用户               |
| AWS Gateway API             | ALB/NLB              | 云托管 LB                          | EKS 用户               |


### Envoy Gateway

![image-20260511150523545](./gateway-api.assets/image-20260511150523545.png)

### 安装 Gateway API CRD

**如果选择Envoy Gateway的话，这一步就不用执行了，因为Envoy Gateway 会自动带上 Gateway API CRD**

```yaml
wget -O gateway-api-install.yaml https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.5.1/standard-install.yaml
kubectl apply --server-side=true -f gateway-api-install.yaml

检查：
kubectl get crd | grep gateway
```

### 安装 Gateway API

方式 A：快速部署

```javascript
wget -O gateway-install.yaml https://github.com/envoyproxy/gateway/releases/download/v1.7.3/install.yaml
kubectl apply -f gateway-install.yaml
```

**方式 B：使用 Helm（推荐）** [helm安装](./helm.md)

```javascript
helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.7.3 -n envoy-gateway-system --create-namespace
```

等待部署：

```javascript
kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available
```



