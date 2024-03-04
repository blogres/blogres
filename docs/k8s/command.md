---
icon: /icons/k8s/k8s_16x16.png
title: Kubernetes-kubectl命令表
category: 
- kubernetes
headerDepth: 5
date: 2020-04-20
order: 14
tag:
- Linux
- k8s
---

Kubernetes kubectl 命令表

<!-- more -->

[Kubernetes 中文社区-文档](http://docs.kubernetes.org.cn/683.html)

[Kubernetes 官网文档](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)


## [1）kubectl-run创建容器镜像](http://docs.kubernetes.org.cn/468.html)

语法：
>run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [--command] -- [COMMAND] [args...]

示例：
启动nginx实例。
>kubectl run nginx --image=nginx

启动hazelcast实例，暴露容器端口 5701。
>kubectl run hazelcast --image=hazelcast --port=5701

启动hazelcast实例，在容器中设置环境变量“DNS_DOMAIN = cluster”和“POD_NAMESPACE = default”。
>kubectl run hazelcast --image=hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"

启动nginx实例，设置副本数5。
>kubectl run nginx --image=nginx --replicas=5

运行 Dry  打印相应的API对象而不创建它们。
>kubectl run nginx --image=nginx --dry-run

### 其它详细说明

|	名称	|	速记	|	默认|	用法	|
|-|-|-|-|
| allow-missing-template-keys |      | true       | If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. |
| attach                      |      | false      | If true, wait for the Pod to start running, and then attach to the Pod as if 'kubectl attach ...' were called. Default false, unless '-i/--stdin' is set, in which case the default is true. With '--restart=Never' the exit code of the container process is returned. |
| command                     |      | false      | If true and extra arguments are present, use them as the 'command' field in the container, rather than the 'args' field which is the default. |
| dry-run                     |      | false      | If true, only print the object that would be sent, without sending it. |
| env                         |      | []         | Environment variables to set in the container                |
| expose                      |      | false      | If true, a public, external service is created for the container(s) which are run |
| generator                   |      |            | The name of the API generator to use, see <http://kubernetes.io/docs/user-guide/kubectl-conventions/#generators> for a list. |
| hostport                    |      | -1         | The host port mapping for the container port. To demonstrate a single-machine container. |
| image                       |      |            | The image for the container to run.                          |
| image-pull-policy           |      |            | The image pull policy for the container. If left empty, this value will not be specified by the client and defaulted by the server |
| include-extended-apis       |      | true       | If true, include definitions of new APIs via calls to the API server. [default true] |
| labels                      | l    |            | Labels to apply to the pod(s).                               |
| leave-stdin-open            |      | false      | If the pod is started in interactive mode or with stdin, leave stdin open after the first attach completes. By default, stdin will be closed after the first attach completes. |
| limits                      |      |            | The resource requirement limits for this container. For example, 'cpu=200m,memory=512Mi'. Note that server side components may assign limits depending on the server configuration, such as limit ranges. |
| no-headers                  |      | false      | When using the default or custom-column output format, don't print headers (default print headers). |
| output                      | o    |            | Output format. One of: `json\|yaml\|wide\|name\|custom-columns=...\|custom-columns-file=...\|go-template=...\|go-template-file=...\|jsonpath=...\|jsonpath-file=...` See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. |
| output-version              |      |            | DEPRECATED: To use a specific API version, fully-qualify the resource, version, and group (for example: 'jobs.v1.batch/myjob'). |
| overrides                   |      |            | An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field. |
| pod-running-timeout         |      | 1m0s       | The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running |
| port                        |      |            | The port that this container exposes. If --expose is true, this is also the port used by the service that is created. |
| quiet                       |      | false      | If true, suppress prompt messages.                           |
| record                      |      | false      | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. |
| replicas                    | r    | 1          | Number of replicas to create for this container. Default is 1. |
| requests                    |      |            | The resource requirement requests for this container. For example, 'cpu=100m,memory=256Mi'. Note that server side components may assign requests depending on the server configuration, such as limit ranges. |
| restart                     |      | Always     | The restart policy for this Pod. Legal values [Always, OnFailure, Never]. If set to 'Always' a deployment is created, if set to 'OnFailure' a job is created, if set to 'Never', a regular pod is created. For the latter two --replicas must be 1. Default 'Always', for CronJobs `Never`. |
| rm                          |      | false      | If true, delete resources created in this command for attached containers. |
| save-config                 |      | false      | If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future. |
| schedule                    |      |            | A schedule in the Cron format the job should be run with.    |
| service-generator           |      | service/v2 | The name of the generator to use for creating a service. Only used if --expose is true |
| service-overrides           |      |            | An inline JSON override for the generated service object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field. Only used if --expose is true. |
| show-all                    | a    | false      | When printing, show all resources (default hide terminated pods.) |
| show-labels                 |      | false      | When printing, show all labels as the last column (default hide labels column) |
| sort-by                     |      |            | If non-empty, sort list types using this field specification. The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. |
| stdin                       | i    | false      | Keep stdin open on the container(s) in the pod, even if nothing is attached. |
| template                    |      |            | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. |
| tty                         | t    | false      | Allocated a TTY for each container in the pod.               |


## [2）kubectl-expose（将资源暴露为新的Service）](http://docs.kubernetes.org.cn/475.html)

### 其它详细说明

## [3）kubectl-annotate（更新资源的Annotations信息）](http://docs.kubernetes.org.cn/477.html)

### 其它详细说明

## [4）kubectl-autoscale（Pod水平自动伸缩）](http://docs.kubernetes.org.cn/486.html)

### 其它详细说明

## [5）kubectl-convert（转换配置文件为不同的API版本）](http://docs.kubernetes.org.cn/488.html)

### 其它详细说明

## [6）kubectl-create（创建一个集群资源对象](http://docs.kubernetes.org.cn/490.html)

### 其它详细说明

## [7）kubectl-create-clusterrole（创建ClusterRole）](http://docs.kubernetes.org.cn/492.html)

### 其它详细说明

## [8）kubectl-create-clusterrolebinding（为特定的ClusterRole创建ClusterRoleBinding）](http://docs.kubernetes.org.cn/494.html)

### 其它详细说明

## [9）kubectl-create-configmap（创建configmap）](http://docs.kubernetes.org.cn/533.html)

### 其它详细说明

## [10）kubectl-create-deployment（创建deployment）](http://docs.kubernetes.org.cn/535.html)

### 其它详细说明

## [11）kubectl-create-namespace（创建namespace）](http://docs.kubernetes.org.cn/537.html)

### 其它详细说明

## [12）kubectl-create-poddisruptionbudget（创建poddisruptionbudget）](http://docs.kubernetes.org.cn/539.html)

### 其它详细说明

## [13）kubectl-create-quota（创建resourcequota）](http://docs.kubernetes.org.cn/541.html)

### 其它详细说明

## [14）kubectl-create-role（创建role）](http://docs.kubernetes.org.cn/543.html)

### 其它详细说明

## [15）kubectl-create-rolebinding（为特定Role或ClusterRole创建RoleBinding）](http://docs.kubernetes.org.cn/545.html)

### 其它详细说明

## [16）kubectl-create-service（使用指定的子命令创建Service服务）](http://docs.kubernetes.org.cn/564.html)

### 其它详细说明

## [17）kubectl-create-service-clusterip](http://docs.kubernetes.org.cn/566.html)

### 其它详细说明

## [18）kubectl-create-service-externalname](http://docs.kubernetes.org.cn/568.html)

### 其它详细说明

## [19）kubectl-create-service-loadbalancer](http://docs.kubernetes.org.cn/570.html)

### 其它详细说明

## [20）kubectl-create-service-nodeport](http://docs.kubernetes.org.cn/572.html)

### 其它详细说明

## [21）kubectl-create-serviceaccount](http://docs.kubernetes.org.cn/574.html)

### 其它详细说明

## [22）kubectl-create-secret（使用指定的子命令创建secret）](http://docs.kubernetes.org.cn/548.html)

### 其它详细说明

## [23）kubectl-create-secret-tls](http://docs.kubernetes.org.cn/558.html)

### 其它详细说明

## [24）kubectl-create-secret-generic](http://docs.kubernetes.org.cn/556.html)

### 其它详细说明

## [25）kubectl-create-secret-docker-registry](http://docs.kubernetes.org.cn/554.html)

### 其它详细说明

## [26）kubectl-delete（删除资源对象）](http://docs.kubernetes.org.cn/618.html)

### 其它详细说明

## [27）kubectl-edit（编辑服务器上定义的资源对象）](http://docs.kubernetes.org.cn/623.html)

### 其它详细说明


## [28）kubectl-get（获取资源信息）](http://docs.kubernetes.org.cn/626.html)

```
可以使用的资源包括：
    all
    certificatesigningrequests (aka 'csr')
    clusterrolebindings
    clusterroles
    clusters (valid only for federation apiservers)
    componentstatuses (aka 'cs')
    configmaps (aka 'cm')
    controllerrevisions
    cronjobs
    daemonsets (aka 'ds')
    deployments (aka 'deploy')
    endpoints (aka 'ep')
    events (aka 'ev')
    horizontalpodautoscalers (aka 'hpa')
    ingresses (aka 'ing')
    jobs
    limitranges (aka 'limits')
    namespaces (aka 'ns')
    networkpolicies (aka 'netpol')
    nodes (aka 'no')
    persistentvolumeclaims (aka 'pvc')
    persistentvolumes (aka 'pv')
    poddisruptionbudgets (aka 'pdb')
    podpreset
    pods (aka 'po')
    podsecuritypolicies (aka 'psp')
    podtemplates
    replicasets (aka 'rs')
    replicationcontrollers (aka 'rc')
    resourcequotas (aka 'quota')
    rolebindings
    roles
    secrets
    serviceaccounts (aka 'sa')
    services (aka 'svc')
    statefulsets
    storageclasses
    thirdpartyresources
```

**语法**

> get [(-o|--output=)json|yaml|wide|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=...] (TYPE [NAME | -l label] | TYPE/NAME ...) [flags]

**示例**

列出所有运行的Pod信息。

>kubectl get pods

列出Pod以及运行Pod节点信息。

>kubectl get pods -o wide

列出指定NAME的 replication controller信息。

>kubectl get replicationcontroller web

以JSON格式输出一个pod信息。

>kubectl get -o json pod web-pod-13je7

以“pod.yaml”配置文件中指定资源对象和名称输出JSON格式的Pod信息。

>kubectl get -f pod.yaml -o json

返回指定pod的相位值。

`kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}`

列出所有replication controllers和service信息。

>kubectl get rc,services

按其资源和名称列出相应信息。

>kubectl get rc/web service/frontend pods/web-pod-13je7

列出所有不同的资源对象。

>kubectl get all

### 其它详细说明


| 名称                                   | 速记 | 默认           | 用法                                                         |
| -------------------------------------- | ---- | -------------- | ------------------------------------------------------------ |
| all-namespaces                         |      | false          | 如果存在，则列出所有命名空间中请求的对象。  即使使用 --namespace 指定，当前上下文中的命名空间也会被忽略。( k get pods --all-namespaces) |
| allow-missing-template-keys            |      | true           | 如果为 true，则在模板中缺少字段或映射键时忽略模板中的任何错误。  仅适用于 golang 和 jsonpath 输出格式。 |
| experimental-use-openapi-print-columns |      | false          | 如果为true，则使用openapi模式中的x-kubernetes-print-column元数据（如果存在）来显示资源。 |
| export                                 |      | false          | 如果为 true，则对资源使用“导出”。  导出的资源将删除特定于集群的信息。 |
| filename                               | f    | []             | 文件名、目录或文件的 URL，用于标识要从服务器获取的资源。     |
| ignore-not-found                       |      | false          | 将“未找到资源”视为成功检索。                                 |
| include-extended-apis                  |      | true           | 如果为 true，则通过调用 API 服务器包含新 API 的定义。  [默认为true] |
| label-columns                          | L    | []             | 接受逗号分隔的标签列表，这些标签将显示为列。  名称区分大小写。  您还可以使用多个标志选项，例如 -L label1 -L label2. |
| no-headers                             |      | false          | 使用默认或自定义列输出格式时，不要打印标题（默认打印标题）。 |
| output                                 | o    |                | 输出格式。其中之一：`json\yaml\wide\name\custom-columns=...\custom-columns-file=...\go-template=...\go-template-file=...\jsonpath=）...（jsonpath-file=...` 查看自定义列 [ http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns ]，golang 模板 [ http://golang.org/pkg/text/template/#pkg-overview ] 和 jsonpath 模板 [ http://kubernetes.io/docs/user-guide/jsonpath ]）。 |
| output-version                         |      |                | 已弃用：要使用特定的 API 版本，请完全限定资源、版本和组（例如：'jobs.v1.batch/myjob'）。 |
| raw                                    |      |                | 从服务器请求的原始 URI。 使用 kubeconfig 文件指定的传输。    |
| recursive                              | R    | false          | 递归处理 -f, --filename 中使用的目录。 当您想要管理在同一目录中组织的相关清单时很有用。 |
| schema-cache-dir                       |      | ~/.kube/schema | 如果非空，则在此目录中加载/存储缓存的 API 模式，默认为 '$HOME/.kube/schema' |
| selector                               | l    |                | 要过滤的选择器（标签查询），支持“=”、“=”和“！=”              |
| show-all                               | a    | false          | 打印时，显示所有资源（默认隐藏终止的 pod。）                 |
| show-kind                              |      | false          | 如果存在，请列出所请求对象的资源类型。                       |
| show-labels                            |      | false          | 打印时，将所有标签显示为最后一列（默认隐藏标签列）           |
| sort-by                                |      |                | 如果非空，请使用此字段规范对列表类型进行排序。 字段规范表示为 JSONPath 表达式（例如“{.metadata.name}”）。 此 JSONPath 表达式指定的 API 资源中的字段必须是整数或字符串。 |
| template                               |      |                | `-o=go-template, -o=go-template-file` 时使用的模板字符串或模板文件的路径。 模板格式为 golang 模板 [ http://golang.org/pkg/text/template/#pkg-overview ]。 |
| watch                                  | w    | false          | 列出/获取请求的对象后，注意更改。                            |
| watch-only                             |      | false          | 注意对请求对象的更改，而不是首先列出/获取。                  |


## [29）kubectl-label（更新资源对象的label）](http://docs.kubernetes.org.cn/628.html)

### 其它详细说明

## [30）kubectl-patch（使用patch更新资源对象字段）](http://docs.kubernetes.org.cn/632.html)

### 其它详细说明

## [31）kubectl-replace（替换资源对象）](http://docs.kubernetes.org.cn/635.html)

### 其它详细说明

## [32）kubectl-rolling-update（使用RC进行滚动更新）](http://docs.kubernetes.org.cn/638.html)

### 其它详细说明

## [33）kubectl-scale（扩缩Pod数量）](http://docs.kubernetes.org.cn/664.html)

### 其它详细说明

## [34）kubectl-rollout（对资源对象进行管理）](http://docs.kubernetes.org.cn/643.html)

### 其它详细说明

## [35）kubectl-rollout-history（查看历史版本）](http://docs.kubernetes.org.cn/645.html)

### 其它详细说明


## [36）kubectl-rollout-pause（标记资源对象为暂停状态）](http://docs.kubernetes.org.cn/647.html)

### 其它详细说明

## [37）kubectl-rollout-resume（恢复已暂停资源）](http://docs.kubernetes.org.cn/650.html)

### 其它详细说明

## [38）kubectl-rollout-status（查看资源状态）](http://docs.kubernetes.org.cn/652.html)

### 其它详细说明

## [39）kubectl-rollout-undo（回滚版本）](http://docs.kubernetes.org.cn/654.html)

### 其它详细说明

## [40）kubectl-set（配置应用资源）](http://docs.kubernetes.org.cn/669.html)

### 其它详细说明

## [41）kubectl-set-resources（指定Pod的计算资源需求）](http://docs.kubernetes.org.cn/671.html)

### 其它详细说明

## [42）kubectl-set-selector（设置资源对象selector）](http://docs.kubernetes.org.cn/672.html)

### 其它详细说明

## [43）kubectl-set-image（更新已有资源对象中的容器镜像）](http://docs.kubernetes.org.cn/670.html)

### 其它详细说明

## [44）kubectl-set-subject（更新RoleBinding/ClusterRoleBinding中User、Group或ServiceAccount）](http://docs.kubernetes.org.cn/681.html)

### 其它详细说明


![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/0b47ba4e4badb6a5c1b4847c4c853f2d.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/f2eebfeca25746564b878193b03328cd.png#pic_center)
