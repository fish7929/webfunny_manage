module.exports = {
  appId: "cli_a4481a9ae338500d",
  appSecret: "TRtAQsXm28lXNwfXNSqM9e6u2wmEdrzw",
  redirectUri: "http://127.0.0.1:8008/ssoLoading.html?ssoType=feishu",
  getTenantTokenConfig: {
    method: "post",
    url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
  },
  getAppTokenConfig: {
    method: "post",
    url: "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal"
  },
  getUserTokenConfig: {
    method: "post",
    url: "https://open.feishu.cn/open-apis/authen/v1/access_token"
  },
  getJsTicketConfig: {
    method: "get",
    url: "https://open.feishu.cn/open-apis/jssdk/ticket/get"
  },
  getUserInfoConfig: {
    method: "get",
    url: "https://open.feishu.cn/open-apis/authen/v1/user_info"
  },
}