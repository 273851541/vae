let baseUrl = "http://118.24.128.24:3000"
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList:[],
    currentPlay:{},
    songUrl:"",
    playStatus: false,
    playImg: '../../utils/src/play.png',
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'LOADING',
    })
    this.getPlayList();


  },

  getPlayList(){
    let _this = this;
    wx.request({
      url: baseUrl+'/playlist/detail?id=2384283232',
      success:function(res){
        let data = res.data;
        if(data.code===200){
          let playList = data.playlist.tracks.reverse();
          console.log(playList);
          _this.setData({
            playList: playList
          })
        }
        wx.hideLoading()
      }
    })
  },

  toPlayerView(){
      let id = this.data.currentPlay.id;
    wx.navigateTo({
      url: '../mPlayer/mPlayer?id=' + id
    })
  },

  itemPlayMusic(event) {
    console.log(event);
    let id = event.currentTarget.dataset.id;
    let songInfo = this.data.playList.find(item => {
      return item.id === id;
    });
    this.backgroundAudioManagerHandler(songInfo);
    this.toPlayerView()
  },

  backgroundAudioManagerHandler(songInfo){

    this.setData({
      'currentPlay': songInfo
    })
    console.log(songInfo)
    this.setData({
      'songUrl': 'http://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3',
      'imgurl': songInfo.al.picUrl,
      'playStatus': true
    })
    backgroundAudioManager.title = songInfo.name;
    backgroundAudioManager.epname = songInfo.al.name;
    backgroundAudioManager.singer = songInfo.ar[0].name;
    backgroundAudioManager.duration = songInfo.dt / 1000;
    backgroundAudioManager.webUrl = 'http://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3';
    backgroundAudioManager.src = 'http://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3';
  },

  autoPlayNext(){
    let currentPlay = this.data.currentPlay;
    let playList = this.data.playList;
    let nextIndex;
    nextIndex = playList.findIndex(item=>{
      return item.id === currentPlay.id
    })
    if (nextIndex === playList.length-1){
      nextIndex = 0;
    }else{
      nextIndex++
    }
    this.backgroundAudioManagerHandler(playList[nextIndex])
    backgroundAudioManager.src = 'http://music.163.com/song/media/outer/url?id=' + playList[nextIndex].id + '.mp3';
  },


  onShow(){
    let _this = this
    wx.getBackgroundAudioPlayerState({
      success(res){
        if (res.status === 1) {
          _this.setData({
            playStatus: true
          })
        }else if (res.status === 2){
          _this.setData({
            playStatus: false,
            songUrl:''
          })
        } else if (res.status === 0){
          _this.setData({
            playStatus: false
          })
        }
      }
    })  

    backgroundAudioManager.onPlay(() => {
      this.setData({
        playStatus: true
      })
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        playStatus: false
      })
    })
    backgroundAudioManager.onEnded(() => {
      this.setData({
        playStatus: false
      })
      console.log(132546);
      this.autoPlayNext();
    })
  }



})