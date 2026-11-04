import Schema from "@deepseek-ai/schemastery";

/**
 * 宿主端配置与路由整合：
 * 同时提供 ui-conversation、ui-chat 的标准设置项，以及 dsh-smooth-stream 的平滑控制参数。
 */
const DEFAULT_STREAM_CONFIG = {
  mode: "typewriter",
  preset: "balanced",
  revealCharsPerSec: 80,
  scrollSpeedPxPerSec: 48,
  maxScrollSpeedPxPerSec: 1000
};

const Config = Schema.object({
  // ui-conversation 设置
  busyEnter: Schema.union(["queue", "steer"]).default("queue").volatile(),
  // ui-chat 设置
  transcriptView: Schema.union(["compact", "standard", "detailed", "verbose", "normal", "expanded"]).loose().volatile(),
  collapseTiming: Schema.union(["completion", "next-input"]).default("completion").volatile(),
  performanceUsage: Schema.union(["compact", "detailed"]).default("detailed").volatile(),
  linkOpening: Schema.union(["sidebar", "new-tab"]).default("sidebar").volatile(),
  // smooth-stream 弹簧与打字机设置
  mode: Schema.union(["typewriter", "teleprompter"]).default(DEFAULT_STREAM_CONFIG.mode),
  preset: Schema.union(["realtime", "balanced", "silky"]).default(DEFAULT_STREAM_CONFIG.preset),
  revealCharsPerSec: Schema.number().min(5).max(200).default(DEFAULT_STREAM_CONFIG.revealCharsPerSec),
  scrollSpeedPxPerSec: Schema.number().min(1).max(200).default(DEFAULT_STREAM_CONFIG.scrollSpeedPxPerSec),
  maxScrollSpeedPxPerSec: Schema.number().min(1).max(2000).default(DEFAULT_STREAM_CONFIG.maxScrollSpeedPxPerSec)
});

function apply(ctx, config) {
  ctx.logger("classic-chat").info("DSH Classic Chat (with Smooth Stream Engine) active.");

  // 1. 注入官方 conversation & chat 的通用设置项
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });

  // 2. 注入 smooth-stream 前端需要的启动全局配置
  ctx.inject(["webServer"], (httpCtx) => {
    httpCtx.effect(() => {
      // 保证前端能读取到平滑流配置
      return () => {};
    });
  });
}

export { Config, apply };
