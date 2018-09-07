import url from '../../utils/baseUrl.js'
const backgroundAudioManager = wx.getBackgroundAudioManager();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList: [],
    currentPlay: {},
    songUrl: "",
    playStatus: false,
    playImg: '../../utils/src/play.png',
    imgUrl: '',
    currentId:null,
    currentSwiperId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: 'LOADING',
    })
    this.getPlayList();

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
    let _this = this;
    wx.request({
      url: url.musicList + '?id=2384283232',
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let playList = data.playlist.tracks.reverse();

          _this.setData({
            playList: playList
          })
          app.globalData.musicList = playList;
        }
        wx.hideLoading()
      }
    })
  },

  //点击后跳转至播放页
  toPlayerView(event) {
    if (event.currentTarget.dataset.type==='itemBtn'){
      app.globalData.song=null;
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

    console.log(app.globalData.musicList)

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
  bindchange (){

  },

  //
  // itemPlayMusic(event) {
  //   console.log(event);
  //   let id = event.currentTarget.dataset.id;
  //   let songInfo = this.data.playList.find(item => {
  //     return item.id === id;
  //   });
  //   // this.backgroundAudioManagerHandler(songInfo);
  //   this.toPlayerView()
  // },

  // backgroundAudioManagerHandler(songInfo){

  //   this.setData({
  //     'currentPlay': songInfo
  //   })
  //   console.log(songInfo)
  //   this.setData({
  //     'songUrl': 'https://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3',
  //     'imgurl': songInfo.al.picUrl,
  //     'playStatus': true
  //   })
  //   backgroundAudioManager.title = songInfo.name;
  //   backgroundAudioManager.epname = songInfo.al.name;
  //   backgroundAudioManager.singer = songInfo.ar[0].name;
  //   backgroundAudioManager.duration = songInfo.dt / 1000;
  //   backgroundAudioManager.webUrl = 'https://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3';
  //   backgroundAudioManager.src = 'https://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3';
  // },

  // autoPlayNext(){
  //   let currentPlay = this.data.currentPlay;
  //   let playList = this.data.playList;
  //   let nextIndex;
  //   nextIndex = playList.findIndex(item=>{
  //     return item.id === currentPlay.id
  //   })
  //   if (nextIndex === playList.length-1){
  //     nextIndex = 0;
  //   }else{
  //     nextIndex++
  //   }
  //   this.backgroundAudioManagerHandler(playList[nextIndex])
  //   backgroundAudioManager.src = 'https://music.163.com/song/media/outer/url?id=' + playList[nextIndex].id + '.mp3';
  // },


  // onShow(){
  //   let _this = this
  //   wx.getBackgroundAudioPlayerState({
  //     success(res){
  //       if (res.status === 1) {
  //         _this.setData({
  //           playStatus: true
  //         })
  //       }else if (res.status === 2){
  //         _this.setData({
  //           playStatus: false,
  //           songUrl:''
  //         })
  //       } else if (res.status === 0){
  //         _this.setData({
  //           playStatus: false
  //         })
  //       }
  //     }
  //   })  

  //   backgroundAudioManager.onPlay(() => {
  //     this.setData({
  //       playStatus: true
  //     })
  //   })
  //   backgroundAudioManager.onPause(() => {
  //     this.setData({
  //       playStatus: false
  //     })
  //   })
  //   backgroundAudioManager.onEnded(() => {
  //     this.setData({
  //       playStatus: false
  //     })
  //     console.log(132546);
  //     this.autoPlayNext();
  //   })
  // }



})