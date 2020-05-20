// pages/my/my.js
const app = getApp();
var MyTableObject = new wx.BaaS.TableObject("_userprofile");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  getuserinfo(e) {
    let _this = this;
    wx.BaaS.auth.loginWithWechat(e).then(user => {
      // user 包含用户完整信息，详见下方描述
      this.queryUserInfo(user.id)

      wx.setStorage({
        data: user,
        key: 'userInfo',
        success() {
          _this.setData({
            userInfo: user
          })
        }
      })
    }, err => {
      console.log(err)
      // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解）
    })
  },

  previewImage: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=vZZA23c9Dd%2BgPc1CLmE7uw%3D%3D'
    })
  },

  toLoveList(){
    wx.navigateTo({
      url: '../loveList/loveList',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'userInfo',
      success({ data }) {
        if (data) {
          _this.setData({
            userInfo: data
          })
        }
      }
    })
  },

  queryUserInfo(id){
    let query = new wx.BaaS.Query();
    query.compare("id","=",id)
    MyTableObject.setQuery(query).find().then(res => {
      console.log(res)
      app.globalData.userInfo = res.data.objects[0]
    }, err => {
      console.log(err)// err
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})