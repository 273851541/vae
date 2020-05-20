// pages/loveList/loveList.js
import url from '../../utils/baseUrl.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    love_song: [],
    currentId: null,
    imgUrl: '',
    playStatus: false,
  },

  queryUserInfo(id) {
    wx.showLoading({
      title: 'LOADING'
    })
    var MyTableObject = new wx.BaaS.TableObject("_userprofile");
    let query = new wx.BaaS.Query();
    query.compare("id", "=", id)
    MyTableObject.setQuery(query).find().then(res => {
      this.setData({
        love_song: res.data.objects[0].love_song
      })
      wx.hideLoading()
    }, err => {
      console.log(err) // err
    });
  },

  //点击后跳转至播放页
  toPlayerView(event) {
    if (event.currentTarget.dataset.type === 'itemBtn') {
      app.globalData.song = null;
      app.globalData.musicList = this.data.love_song;
    }
    let id = event.currentTarget.dataset.id;
    if (!id) return
    wx.navigateTo({
      url: '../play/play?id=' + id
    })
  },


  //音乐播放事件
  playStatus() {
    let {
      song,
      songInfo
    } = app.globalData;
    if (song && !song.paused) {
      this.setData({
        playStatus: !song.paused
      })
      song.onPlay(() => {
        this.setData({
          playStatus: true
        })
      })
      song.onPause(() => {
        this.setData({
          playStatus: false
        })
      })
      song.onEnded(() => {
        this.setData({
          playStatus: false
        })
        this.autoNextPlay();
      })
      song.onStop(() => {
        this.setData({
          playStatus: false,
          imgurl: '',
          currentId: null
        })
      })
      song.onError(() => {
        wx.showToast({
          title: '播放错误',
        })
      })
      song.onNext(() => {
        this.autoNextPlay()
      })
      song.onPrev(() => {
        this.autoPrevPlay()
      })
    }
    if (songInfo) {
      this.setData({
        currentId: songInfo.id,
        imgurl: songInfo.al.picUrl
      })
    }
  },

  //下一曲
  autoNextPlay() {
    let currentId = this.data.currentId;
    let musicList = app.globalData.musicList
    let nextIndex = musicList.findIndex(item => {
      return item.id === currentId;
    })
    let nextItemData;
    if (nextIndex >= musicList.length - 1) {
      nextItemData = musicList[0];
    } else {
      nextItemData = musicList[nextIndex + 1];
    }
    this.backgroundAudioManagerHandler(nextItemData);
  },
  //上一曲
  autoPrevPlay() {
    let currentId = this.data.currentId;
    let musicList = app.globalData.musicList
    let nextIndex = musicList.findIndex(item => {
      return item.id === currentId;
    })
    let nextItemData;
    if (nextIndex === 0) {
      nextItemData = musicList[0];
    } else {
      nextItemData = musicList[musicList.length - 1];
    }
    this.backgroundAudioManagerHandler(nextItemData);
  },

  //背景音乐赋值
  backgroundAudioManagerHandler(songInfo) {
    let {
      song
    } = app.globalData;
    song.src = url.songUrl + '?id=' + songInfo.id + '.mp3';
    song.play();
    song.title = songInfo.name;
    song.epname = songInfo.epname;
    song.singer = songInfo.singer;
    song.coverImgUrl = songInfo.picUrl
    song.duration = songInfo.duration / 1000;
    song.webUrl = url.songUrl + '?id=' + songInfo.id + '.mp3';
    this.setData({
      currentId: songInfo.id,
      imgurl: songInfo.picUrl,
      playStatus: true
    })
    app.globalData.songInfo = songInfo;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let userInfo = app.globalData.userInfo;
    // if(userInfo.id&&userInfo.nickname){
    this.queryUserInfo("178438000657972")
    // }
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
     // let userInfo = app.globalData.userInfo;
    // if(userInfo.id&&userInfo.nickname){
      this.queryUserInfo("178438000657972")
      // }
    this.playStatus();
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