

App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('ef1359e432b6437d6be4');

    wx.getSetting({
      complete: (res) => {
        console.log(res)
        // if(res.errMsg==="getSetting:ok"){
        //   wx.getUserInfo({
        //     complete: (res) => {
        //       console.log(res)
        //     },
        //   })
        // }
      },
    })
      
  },


  globalData:{
    song:null,
    musicList:[],
    songInfo:null,
    userInfo:null
  }
})
