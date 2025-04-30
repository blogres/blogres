---
icon: github
title: Github文档
category: 
- Git
# headerDepth: 5
date: 2021-01-16
order: 5
tag:
- Github
---

在工作流中获取github的上下文、示例等，

<!-- more -->

## 获取github上下文

*示例*

```yml
name: 输出github信息

on:
  push:
    branches:
      - main
jobs:
  dump_contexts_to_log:
    runs-on: ubuntu-latest
    steps:
      - name: GitHub context
        id: github_context_step
        run: echo '${{ toJSON(github) }}'

      - name: startout2
        id: github_context_message
        # toJSON 输出有双引号
        run: echo ${{ toJSON(github.event.head_commit.message) }}
    
      - name: 根据提交信息来触发任务
        if: startsWith(github.event.head_commit.message, 'outpp')
        id: message
        run: |
          echo ${{ github.event.head_commit.message }}
          echo 执行成功结束

```

执行结果

```
Run echo outpp
  echo outpp
  echo 执行成功结束
  shell: /usr/bin/bash -e {0}
outpp
执行成功结束
```

输出github上下文内容

```yml
{
  "token": "***",
  "job": "dump_contexts_to_log",
  "ref": "refs/heads/main",
  "sha": "1b7f2d4cb8395dcc3",
  "repository": "to/to",
  "repository_owner": "to",
  "repository_owner_id": "12026",
  "repositoryUrl": "git://github.com/to/to.git",
  "run_id": "4692",
  "run_number": "3",
  "retention_days": "90",
  "run_attempt": "1",
  "artifact_cache_size_limit": "10",
  "repository_visibility": "public",
  "repository_id": "5717",
  "actor_id": "15",
  "actor": "to",
  "triggering_actor": "to",
  "workflow": "输出github信息",
  "head_ref": "",
  "base_ref": "",
  "event_name": "push",
  "event": {
    "after": "1b7f2dc4cadeb15dcc3",
    "base_ref": null,
    "before": "68b1b7209982075",
    "commits": [
      {
        "author": {
          "email": "to@163.com",
          "name": "to",
          "username": "to"
        },
        "committer": {
          "email": "noreply@github.com",
          "name": "GitHub",
          "username": "web-flow"
        },
        "distinct": true,
        "id": "1b7f2d4cbdeb15dcc3",
        "message": "更新github工作流输出信息\n\n66",
        "timestamp": "2023-04-12T14:07:30+08:00",
        "tree_id": "2ba03c9ec54bb9e1109a8fbc31",
        "url": "https://github.com/to/to/commit/1b77a6a9c4ca5dcc3"
      }
    ],
    "compare": "https://github.com/to/to/compare/68bd9...1b7f239",
    "created": false,
    "deleted": false,
    "forced": false,
    "head_commit": {
      "author": {
        "email": "to@163.com",
        "name": "to",
        "username": "to"
      },
      "committer": {
        "email": "noreply@github.com",
        "name": "GitHub",
        "username": "web-flow"
      },
      "distinct": true,
      "id": "1b7f2d4c5dcc3",
      "message": "更新github工作流输出信息\n\n66",
      "timestamp": "2023-04-12T14:07:30+08:00",
      "tree_id": "2ba03c9ec54b8fbc31",
      "url": "https://github.com/to/to/commit/1b7f2d4c9dcc3"
    },
    "organization": {
      "avatar_url": "https://avatars.githubusercontent.com/u/12023?v=4",
      "description": null,
      "events_url": "https://api.github.com/orgs/to/events",
      "hooks_url": "https://api.github.com/orgs/to/hooks",
      "id": 12026,
      "issues_url": "https://api.github.com/orgs/to/issues",
      "login": "to",
      "members_url": "https://api.github.com/orgs/to/members{/member}",
      "node_id": "O_kgg",
      "public_members_url": "https://api.github.com/orgs/to/public_members{/member}",
      "repos_url": "https://api.github.com/orgs/to/repos",
      "url": "https://api.github.com/orgs/to"
    },
    "pusher": {
      "email": "to@163.com",
      "name": "to"
    },
    "ref": "refs/heads/main",
    "repository": {
      "allow_forking": true,
      "archive_url": "https://api.github.com/repos/to/to/{archive_format}{/ref}",
      "archived": false,
      "assignees_url": "https://api.github.com/repos/to/to/assignees{/user}",
      "blobs_url": "https://api.github.com/repos/to/to/git/blobs{/sha}",
      "branches_url": "https://api.github.com/repos/to/to/branches{/branch}",
      "clone_url": "https://github.com/to/to.git",
      ....
    }
  },
  "server_url": "https://github.com",
  "api_url": "https://api.github.com",
  "graphql_url": "https://api.github.com/graphql",
  "ref_name": "main",
  "ref_protected": false,
  "ref_type": "branch",
  "secret_source": "Actions",
  "workflow_ref": "to/to/.github/workflows/echogithub.yml@refs/heads/main",
  "workflow_sha": "1b7f2d4cb839ca1b993a0b7a",
  "workspace": "/home/runner/work/blogres/blogres",
  "action": "github_context_step",
  "event_path": "/home/runner/work/_temp/_github_workflow/event.json",
  "action_repository": "",
  "action_ref": "",
  "path": "/home/runner/work/_temp/_runner_file_commands/add_path_ae68aad5-a472",
  "env": "/home/runner/work/_temp/_runner_file_commands/set_env_ae68aad5-a472",
  "step_summary": "/home/runner/work/_temp/_runner_file_commands/step_summary_ae68aad5-a472",
  "state": "/home/runner/work/_temp/_runner_file_commands/save_state_ae68aad5-a472",
  "output": "/home/runner/work/_temp/_runner_file_commands/set_output_ae68aad5-a472"
}
```




