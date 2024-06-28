module.exports = {
  reactStrictMode: false,
  env: {
    VG_API_HOST: process.env.VG_API_HOST,
    PUBNUB_PUBLISH_KEY : process.env.PUBNUB_PUBLISH_KEY,
    PUBNUB_SUBSCRIBE_KEY : process.env.PUBNUB_SUBSCRIBE_KEY,
    PUBNUB_USER_ID : process.env.PUBNUB_USER_ID,
    VG_DASHBOARD_HOST: process.env.VG_DASHBOARD_HOST
  },
  images:{
    domains:['videographond.akamaized.net']
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}
