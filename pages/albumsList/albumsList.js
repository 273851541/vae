import url from '../../utils/baseUrl.js'
const backgroundAudioManager = wx.getBackgroundAudioManager();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumsInfo:[],
    albumsDetails:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    // let id = 72977174;
    this.getAlbumsList(id)
  },

  //获取专辑歌曲列表
  getAlbumsList(id) {
    let timer = setTimeout(() => {
      wx.showLoading({
        title: 'LOADING',
      })
    }, 500)
    let _this = this;
    wx.request({
      url: url.album + '?id=' + id,
      success: function(res) {
        wx.hideLoading()
        clearTimeout(timer)
        let data = res.data;
        if (data.code === 200) {
          _this.setData({
            albumsInfo: data.songs,
            albumsDetails:data.album
          })
        }
      },
      fail: function() {
        clearTimeout(timer)
      }
    })

  },


  //点击后跳转至播放页
  toPlayerView(event) {
      app.globalData.song = null;
    let id = event.currentTarget.dataset.id;
    if (!id) return
    wx.navigateTo({
      url: '../play/play?id=' + id
    })
    app.globalData.musicList = this.data.albumsInfo;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  //背景音乐赋值
  backgroundAudioManagerHandler(songInfo) {
    let { song } = app.globalData;
    song.src = url.songUrl + '?id=' + songInfo.id + '.mp3';
    song.play();
    song.title = songInfo.name;
    song.epname = songInfo.al.name;
    song.singer = songInfo.ar[0].name;
    song.coverImgUrl = songInfo.al.picUrl
    song.duration = songInfo.dt / 1000;
    song.webUrl = url.songUrl + '?id=' + songInfo.id + '.mp3';
    app.globalData.songInfo = songInfo;
  },

  //上下一曲
  autoNextPlay() {
    let currentId = this.data.currentId;
    let nextIndex = this.data.playList.findIndex(item => {
      return item.id === currentId;
    })
    let nextItemData;
    if (nextIndex >= this.data.playList.length - 1) {
      nextItemData = this.data.playList[0];
    } else {
      nextItemData = this.data.playList[nextIndex + 1];
    }
    this.backgroundAudioManagerHandler(nextItemData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})