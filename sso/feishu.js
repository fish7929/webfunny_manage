module.exports = {
  client_id: "cli_d95afb52832d9a69720",
  client_secret: "16f6f11cd2ff4e488eeb16e54ada9eb9",
  redirect_uri: "https://syjk.test.norincogroup-ebuy.com/webfunny_center/ssoLoading.html",
  getTokenConfig: {
    method: "post",
    url: "https://msauth.test.norincogroup-ebuy.com/msmauth/oauth/token"
  },
  getUserInfoConfig: {
    method: "post",
    url: "https://msauth.test.norincogroup-ebuy.com/msmauth/userInfo"
  },
}