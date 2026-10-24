export interface WalineConfig {
  serverURL: string;
  /** Emoji package URLs loaded by the Waline picker. */
  emoji?: string[];
}

/** Public Waline settings shared by every article comment section. */
export const walineConfig: WalineConfig = {
  serverURL: 'https://comment.britliang.top',
  emoji: ['https://unpkg.com/@waline/emojis@1.1.0/weibo'],
};
