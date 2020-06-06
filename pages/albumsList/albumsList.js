import url from '../../utils/baseUrl.js'
const backgroundAudioManager = wx.getBackgroundAudioManager();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumsInfo: [],
    albumsDetails: {},
    bgColor: '',
    isShowEPDetail:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: 'LOADING',
    })

    let id = options.id;
    // let id = 16959;
    this.getAlbumsList(id)

  },

  isShowEPDetailHandle(){
    this.setData({
      isShowEPDetail:true
    })
  },

  onClose(){
    this.setData({
      isShowEPDetail:false
    })
  },

  //获取专辑歌曲列表
  getAlbumsList(id) {
    let _this = this;
    wx.request({
      url: url.album + '?id=' + id,
      success: function(res) {
        wx.hideLoading()
        let data = res.data;
        if (data.code === 200) {
          let description = data.album.description||"";
          data.album.description = description.replace(/'\n\n'/g, '<br/>')
          _this.setData({
            albumsInfo: data.songs,
            albumsDetails: data.album
          })
          wx.setNavigationBarTitle({
            title: data.album.name
          })
          wx.hideLoading();
        }
      },
      fail: function() {
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

  //背景赋值
  backgroundAudioManagerHandler(songInfo) {
    let {
      song
    } = app.globalData;
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
})