/// <reference path="./types/index.d.ts" />

interface IAppOption {
  data: Record<string, any>
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  /** 检查小程序更新 */
  checkForUpdate: () => void
  /** 封装路由 */
  navigateTo: (url: string) => void
  /** 用户登录，刷新 token */
  login: () => Promise<void>
}