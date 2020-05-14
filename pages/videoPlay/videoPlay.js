// pages/videoPlay/videoPlay.js
import url from '../../utils/baseUrl.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // id: 0,
    // imgurl16v9: '',
    // duration: 0,
    // videoUrl:'',
    // name:''
    id: 10925701,
    imgurl16v9: 'http://p1.music.126.net/x7j7N5pbjH7jBIddQ2gdNg==/109951164882944905.jpg',
    duration: 214000,
    videoUrl:'http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/2089512768/5db53a989d6b8d4fd1ec87a3849c4289.mp4?wsSecret=a17d5c86d2a048698ce0ab9773d75e59&wsTime=1589461948',
    name:'全世界最好的你',
    relatedVideoData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   id: options.id,
    //   imgurl16v9: decodeURIComponent(options.imgurl16v9),
    //   duration: options.duration,
    //   name: options.name,
    //   videoUrl:decodeURIComponent(options.videoUrl)
    // })
    this.getAllVideo(10925701);
    wx.setNavigationBarTitle({
      title:"全世界最好的你"
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let videoContext = wx.createVideoContext(`mvVideo-${this.data.id}`);
    videoContext.play();
  },

  getAllVideo(id){
    let _this = this;
    wx.request({
      url: url.relatedVideo+'?id='+id,
      success(res){
        console.log(res)
        if(res.data.code===200){
          let data = res.data.data;
          _this.setData({
            relatedVideoData:data
          })
        }
      }
    })
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