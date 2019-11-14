// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    QRCode:''
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接   
      urls: this.data.QRCode.split(',') // 需要预览的图片http链接列表   
    })
  },

  handleContact(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    var scene_img = 'https://cloud-minapp-18952.cloud.ifanrusercontent.com/1g0iZUchzQDCBbEe.png' //这里添加图片的地址
    that.setData({
      QRCode: scene_img
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