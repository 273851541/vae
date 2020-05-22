import url from './utils/baseUrl.js'

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

    wx.BaaS.auth.loginWithWechat().then(user => {
      // 登录成功
      let _this = this;
      wx.getStorage({
        key: 'userInfo',
        success({ data }) {
          if (data) {
            if(user.id&&user.nickname){
              _this.queryUserInfo(user.id)
            }
          }
        }
      })
    }, err => {
      wx.showToast({
        title: "code:"+err.code+" "+err.message
      })
    })

  },

  queryUserInfo(id){
    let query = new wx.BaaS.Query();
    query.compare("id","=",id)
    let _this = this;
    var MyTableObject = new wx.BaaS.TableObject("_userprofile");
    MyTableObject.setQuery(query).find().then(res => {
      this.globalData.userInfo = res.data.objects[0]
    }, err => {
      console.log(err)// err
    });
  },

  globalData: {
    song: null,
    musicList: [],
    songInfo: null,
    userInfo: null,
    love_song:[]
  }
})