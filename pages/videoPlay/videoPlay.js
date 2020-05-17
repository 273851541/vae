// pages/videoPlay/videoPlay.js
import url from '../../utils/baseUrl.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    imgurl16v9: '',
    duration: 0,
    videoUrl:'',
    name:'',
    // id: 10925701,
    // imgurl16v9: 'http://p1.music.126.net/x7j7N5pbjH7jBIddQ2gdNg==/109951164882944905.jpg',
    // duration: 214000,
    // videoUrl:'http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/2089512768/5db53a989d6b8d4fd1ec87a3849c4289.mp4?wsSecret=a17d5c86d2a048698ce0ab9773d75e59&wsTime=1589461948',
    // name:'全世界最好的你',
    relatedVideoData:[]
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
    this.getAllVideo(options.id);
    wx.setNavigationBarTitle({
      title:options.name
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
  
  playVideo(e){
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: 'LOADING',
      mask:true
    })
    let _this = this;
    wx.request({
      url: url.videoUrl+'?id='+id,
      success:function(res){
        if(res.data.code===200){
          let urls = res.data.urls[0];
          let relatedVideoData = _this.data.relatedVideoData;
          relatedVideoData.map(s=>{
            if(s.vid === id){
              _this.setData({
                videoUrl:urls.url,
                name:s.title,
                duration:s.durationms,
                imgurl16v9:s.coverUrl,
                id:urls.id
              })
              wx.setNavigationBarTitle({
                title:s.title
              })
              _this.getAllVideo(urls.id)
            }
          })
        }
        wx.hideLoading()
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
    return {
      title: this.data.name,
      path: '/page/videoPlay/videoPlay?id=' + this.data.id + '&imgurl16v9=' + encodeURIComponent(this.data.imgurl16v9) + '&duration=' + (this.data.duration) + '&videoUrl=' + encodeURIComponent(this.data.videoUrl) + '&name=' + (this.data.name)
    }

    console.log()
  }
})