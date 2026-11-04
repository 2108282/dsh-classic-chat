# dsh-classic-chat

> 针对 DeepSeek Harness（`dsh`）打造的经典极速对话窗插件。  
> 沿用 0.2.1-rc.5 完整、稳定的会话装配与排版渲染引擎，物理屏蔽 0.2.2+ 新版引起的全局回流与流式卡顿，并无缝兼容未来协议新字段。

---

## 解决的核心问题

1. **彻底终结 0.2.2+ 对话流式卡死**：
   官方自 0.2.2-alpha 开始引入了复杂的树状折叠动效与帧时钟重排，加之未做历史消息的布局隔离，导致在大模型高速吐字时引发主线程全局回流（Reflow Storm），手机与轻量设备上卡顿严重。
2. **解除 3 帧 rAF 嵌套死锁**：
   官方原版在分发流式 Token 时硬性嵌套了 3 层 `requestAnimationFrame`，人为引入了 ~50ms 延迟。本插件将其优化为原生单帧调度（60/120fps），打字机吐字速度瞬间恢复原生流畅。
3. **切断历史回流（CSS Containment）**：
   对已完成的历史对话卡片自动注入 `contain: layout paint style !important`。无论底部模型生成多么复杂的大段代码或表格，历史 DOM 几何尺寸均被硬件隔离，渲染性能提升 90% 以上。
4. **深度兼容 0.2.2+ 协议新特性**：
   - 容错处理 `ignorable: true` 未知新事件，避免控制台报错闪退；
   - 容错处理 `outcome.kind === 'abandoned'` 中途废弃流，防止界面残留未完成草稿；
   - 完美适配后续安装的 `dsh-smooth-stream` 等上层平滑插件。

---

## 插件架构与工作原理

本插件基于 DSH 的 Cordis 微内核架构构建，安装后通过 `cordis.patch.yml` 自动执行声明：
- **物理屏蔽原生**：自动将官方 `@deepseek-ai/dsh-client-ui-conversation` 与 `@deepseek-ai/dsh-client-ui-chat` 声明为 `disabled: true`；
- **自包含无缝替代**：本插件自包含 0.2.1-rc.5 的完整装配与渲染代码，并在加载器中同时满足 `@deepseek-ai/dsh-client-ui-conversation` 与 `@deepseek-ai/dsh-client-ui-chat` 的模块导出契约，所有依赖它们的第三方插件（如工具卡片、审批弹窗、平滑流）均不受任何影响。

---

## 安装与使用

### 1. 安装插件
在 DSH 根目录或任意终端执行：
```bash
dsh plugin add dsh-classic-chat
```
或者克隆本仓库到本地后本地链接安装：
```bash
git clone https://github.com/2108282/dsh-classic-chat.git /root/.dsh/plugin-src/dsh-classic-chat
cd /root/.dsh/profiles/web
pnpm add link:/root/.dsh/plugin-src/dsh-classic-chat
```

### 2. 在 Profile Bundles 中启用
确保在 `$DSH_HOME/profiles/web/package.json` 的 `dsh.profile.bundles` 中包含：
```json
"bundles": [
  "@deepseek-ai/dsh-base",
  "@deepseek-ai/dsh-web-app",
  ...
  "dsh-classic-chat",
  "dsh-smooth-stream"
]
```
> **注意**：如果同时安装了 `dsh-smooth-stream`，请将 `dsh-classic-chat` 排在 `dsh-smooth-stream` 前面。

### 3. 重启生效
重新启动 `dsh web`，刷新浏览器即可享受零卡顿的极速对话体验！

---

## 许可证

[MIT License](LICENSE)
