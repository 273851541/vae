// pages/videoPlay/videoPlay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    imgurl16v9: '',
    duration: 0,
    videoUrl:'',
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      imgurl16v9: decodeURIComponent(options.imgurl16v9),
      duration: options.duration,
      name: options.name,
      videoUrl:decodeURIComponent(options.videoUrl)
    })
  
  },


  bindended() {

  },

  bindplay(event) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    let videoContext = wx.createVideoContext(`mvVideo-${this.data.id}`);
    videoContext.play();
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