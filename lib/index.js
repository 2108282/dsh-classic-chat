import Schema from "@deepseek-ai/schemastery";

/**
 * 宿主端配置与生命周期：
 * 完整接管官方 ui-conversation & ui-chat 以及 dsh-smooth-stream 的全部设置项，保持 100% 契约兼容。
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
  // dsh-smooth-stream 平滑打字机参数
  mode: Schema.union(["typewriter", "teleprompter"]).default(DEFAULT_STREAM_CONFIG.mode),
  preset: Schema.union(["realtime", "balanced", "silky"]).default(DEFAULT_STREAM_CONFIG.preset),
  revealCharsPerSec: Schema.number().min(5).max(200).default(DEFAULT_STREAM_CONFIG.revealCharsPerSec),
  scrollSpeedPxPerSec: Schema.number().min(1).max(200).default(DEFAULT_STREAM_CONFIG.scrollSpeedPxPerSec),
  maxScrollSpeedPxPerSec: Schema.number().min(1).max(2000).default(DEFAULT_STREAM_CONFIG.maxScrollSpeedPxPerSec)
});

function apply(ctx, config) {
  ctx.logger("classic-chat").info("DSH Classic Chat (Conversation + Chat + Smooth-Stream) active.");

  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}

export { Config, apply };
