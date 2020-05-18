App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('ef1359e432b6437d6be4', {
      autoLogin: true
    });

    let _this = this

    wx.getStorage({
      key: 'userInfo',
      success({
        data
      }) {
        if (data) {
          _this.globalData.userInfo = data
        }
      }
    })

  },


  globalData: {
    song: null,
    musicList: [],
    songInfo: null,
    userInfo: null
  }
})