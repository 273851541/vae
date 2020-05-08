// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  getuserinfo(e){
    console.log(e)
    this.setData({
      userInfo:e.detail.userInfo
    })
    wx.setStorage({
      data: JSON.stringify(e.detail.userInfo),
      key: 'userInfo'
    })
  },

  previewImage: function (e) {
    wx.navigateToMiniProgram({
      appId:'wx18a2ac992306a5a4',
      path:'pages/apps/largess/detail?id=vZZA23c9Dd%2BgPc1CLmE7uw%3D%3D'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'userInfo',
      success({data}){
        if(data){
          _this.setData({
            userInfo:JSON.parse(data)
          })
        }
      }
    })
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