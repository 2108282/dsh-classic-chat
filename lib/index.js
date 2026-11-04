import z from "@deepseek-ai/schemastery";

/**
 * 宿主端配置 schema 与设置注入：
 * 完整提供 ui-conversation 与 ui-chat 声明的全部配置项，保持与官方设置面板 100% 兼容。
 */
const CONVERSATION_SETTINGS_NAMESPACE = "ui-conversation";
const BUSY_ENTER_FIELD = "busyEnter";
const BUSY_ENTER_BEHAVIORS = ["queue", "steer"];
const DEFAULT_BUSY_ENTER_BEHAVIOR = "queue";

const CHAT_SETTINGS_NAMESPACE = "ui-chat";
const TRANSCRIPT_VIEW_FIELD = "transcriptView";
const COLLAPSE_TIMING_FIELD = "collapseTiming";
const COLLAPSE_TIMINGS = ["completion", "next-input"];
const DEFAULT_COLLAPSE_TIMING = "completion";
const TRANSCRIPT_VIEW_MODES = ["compact", "standard", "detailed", "verbose"];
const DEFAULT_TRANSCRIPT_VIEW_MODE = "detailed";
const PERFORMANCE_USAGE_MODES = ["compact", "detailed"];
const DEFAULT_PERFORMANCE_USAGE = "detailed";
const DEFAULT_LINK_OPENING = "sidebar";

const Config = z.object({
  [BUSY_ENTER_FIELD]: z.union([...BUSY_ENTER_BEHAVIORS]).default(DEFAULT_BUSY_ENTER_BEHAVIOR).volatile(),
  [TRANSCRIPT_VIEW_FIELD]: z.union([...TRANSCRIPT_VIEW_MODES, "normal", "expanded"]).loose().volatile(),
  [COLLAPSE_TIMING_FIELD]: z.union([...COLLAPSE_TIMINGS]).default(DEFAULT_COLLAPSE_TIMING).volatile(),
  performanceUsage: z.union([...PERFORMANCE_USAGE_MODES]).default(DEFAULT_PERFORMANCE_USAGE).volatile(),
  linkOpening: z.union(["sidebar", "new-tab"]).default(DEFAULT_LINK_OPENING).volatile()
});

function apply(ctx) {
  ctx.logger("classic-chat").info("DSH Classic Chat active: Official ui-conversation & ui-chat superseded.");
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}

export {
  Config,
  apply,
  CONVERSATION_SETTINGS_NAMESPACE,
  CHAT_SETTINGS_NAMESPACE,
  BUSY_ENTER_BEHAVIORS,
  TRANSCRIPT_VIEW_MODES
};
