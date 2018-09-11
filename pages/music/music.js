import url from '../../utils/baseUrl.js'
const backgroundAudioManager = wx.getBackgroundAudioManager();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList: [],
    albumsList:[],
    currentPlay: {},
    songUrl: "",
    playStatus: false,
    playImg: '../../utils/src/play.png',
    imgUrl: '',
    currentId:null,
    currentSwiperId:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPlayList();
    this.getAlbumsList();

  },


  //音乐播放事件
  playStatus() {
    let {
      song, songInfo
    } = app.globalData;
    if (song && !song.paused ){
      this.setData({
        playStatus: !song.paused
      })
      song.onPlay(()=>{
        this.setData({
          playStatus: true

        })
      })
      song.onPause(()=>{
        this.setData({
          playStatus: false
        })
      })
      song.onEnded(()=>{
        this.setData({
          playStatus: false
        })
        this.autoNextPlay();
      })
      song.onStop(()=>{
        this.setData({
          playStatus: false,
          imgurl:'',
          currentId:null
        })
      })
      song.onError(()=>{
        wx.showToast({
          title: '播放错误',
        })
      })

    }
    if (songInfo){
        this.setData({
          currentId:songInfo.id,
          imgurl:songInfo.al.picUrl
        })
      }
  },

  //获取歌曲播放列表
  getPlayList() {
    let timer = setTimeout(() => {
      wx.showLoading({
        title: 'LOADING',
      })
    }, 500)
    let _this = this;
    wx.request({
      url: url.musicList + '?id=2384283232',
      success: function(res) {
        clearTimeout(timer)
        let data = res.data;
        if (data.code === 200) {
          wx.hideLoading()
          let playList = data.playlist.tracks.reverse();
          _this.setData({
            playList: playList
          })
        }
      },
      fail: function () {
        clearTimeout(timer)
      }
    })
  },

  //获取专辑列表
  getAlbumsList(){
    let timer = setTimeout(()=>{
      wx.showLoading({
        title: 'LOADING',
      })
    },500)
    let _this = this;
    wx.request({
      url: url.albumList+'?id=5771',
      success:function(res){
        // wx.hideLoading()
        clearTimeout(timer)
        let data = res.data;
        if(data.code===200){
          _this.setData({
            albumsList:data.hotAlbums
          })
        }
      },
      fail:function(){
        clearTimeout(timer)
      }
    })
  },

  //点击后跳转至播放页
  toPlayerView(event) {
    if (event.currentTarget.dataset.type==='itemBtn'){
      app.globalData.song=null;
      app.globalData.musicList = this.data.playList;
    }
    let id = event.currentTarget.dataset.id;
    if(!id)return
    wx.navigateTo({
      url: '../play/play?id=' + id
    })
    let itemIndex = this.data.playList.findIndex(item=>{
      return item.id===id;
    })
    this.setData({
      currentId:id,
      imgurl: this.data.playList[itemIndex].al.picUrl
    })


  },

  //点击后跳转至专辑歌曲列表页
  toAlbumsDetails(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../albumsList/albumsList?id=' + id
    })
  },

  //背景音乐赋值
  backgroundAudioManagerHandler(songInfo) {
    let {song}=app.globalData;
    song.src = url.songUrl + '?id=' + songInfo.id + '.mp3';
    song.play();
    song.title = songInfo.name;
    song.epname = songInfo.al.name;
    song.singer = songInfo.ar[0].name;
    song.coverImgUrl = songInfo.al.picUrl
    song.duration = songInfo.dt / 1000;
    song.webUrl = url.songUrl + '?id=' + songInfo.id + '.mp3';
    this.setData({
      currentId: songInfo.id,
      imgurl: songInfo.al.picUrl,
      playStatus:true
    })
    app.globalData.songInfo = songInfo;
  },

  //上下一曲
  autoNextPlay(){
    let currentId = this.data.currentId;
    let nextIndex = this.data.playList.findIndex(item=>{
      return item.id === currentId;
    })
    let nextItemData;
    if (nextIndex >= this.data.playList.length-1){
      nextItemData = this.data.playList[0];
    }else{
      nextItemData = this.data.playList[nextIndex+1];
    }
    this.backgroundAudioManagerHandler(nextItemData);
  },

  onShow(){
    this.playStatus();
  },

  //swiper滑动改变current事件
  bindchange (event){
    if(event.detail.source==='touch'){
      this.setData({
        currentSwiperId:event.detail.current
      })
    }
  },

  //点击切换tab
  clickTab(event){
    let current = event.currentTarget.dataset.current;
    // if (current===0){
    //   this.getPlayList();
    // }else{
    //   this.getAlbumsList();
    // }
    this.setData({
      currentSwiperId: current
    })
  }

})