//index.js
//获取应用实例
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
const baseUrl = 'http://118.24.128.24:3000'
Page({
  data: {
    calendarsList: [],
    newsList: [],
    playStatus: false,
    playImg: '../../utils/src/play.png',
    songUrl: '',
    content: '',
    songInfo: {
      imgUrl: '',
      songName: '',
      singer: '',
    }
  },
  onLoad: function() {
    // this.getList();
    wx.showLoading({
      title: 'LOADING',
      mask:true
    })
    this.getTodayData();
    backgroundAudioManager.onPlay(() => {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
    })
    backgroundAudioManager.onEnded(() => {
      this.setData({ 
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
      backgroundAudioManager.src=" "
    })
    backgroundAudioManager.onWaiting(() => {
      this.setData({
        playStatus: "loading",
        playImg: '../../utils/src/loading.png'
      });
    })
    backgroundAudioManager.onCanplay(() => {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
    })
    backgroundAudioManager.onStop(() => {
      this.setData({
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
      backgroundAudioManager.src = " "
    })
    // backgroundAudioManager.onError(() => {
    //   this.setData({
    //     playStatus: false,
    //     playImg: '../../utils/src/play.png'
    //   });
    //   wx.showToast({
    //     title: '加载失败'
    //   })
    // })


  },
  getList(action) {
    wx.request({
      url: 'https://www.xusong.com/api/NEWS/getCalendarList.json?page=1&pageSize=10',
      success(res) {
        console.log(res.data);
      },
      fail() {

      }
    })
  },
  musicPlayHandler() {
    if (this.data.playStatus) {
      this.setData({
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
      backgroundAudioManager.pause();
    } else {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
      if (!backgroundAudioManager.src || backgroundAudioManager.src===" ") {
        backgroundAudioManager.src = this.data.songUrl
      }else{
        backgroundAudioManager.play();
      }
    }
  },
  getTodayData() {
    let tableId = 48875;
    let query = new wx.BaaS.Query()
    let MyTableObject = new wx.BaaS.TableObject(tableId);
    MyTableObject.setQuery(query).limit(1).offset(Math.floor(Math.random() * 5)).find().then(res => {
      // success
      console.log(res.data);
      let data = res.data.objects[0]
      this.setData({
        'content': data.content,
        ['songInfo.songName']: data.songName,
        ['songInfo.singer']: data.singer,
      })
      this.getSearchSong(data.songName);
    }, err => {
      // err
    })
  },
  getSearchSong(songName) {
    let _this = this;
    wx.request({
      url: baseUrl + '/search?keywords=' + songName + '&limit=5',
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songs = data.result.songs;
          let songId;
          console.log(songs);
          for (let i in songs) {
            if (songs[i].artists[0].name === '许嵩' || songs[i].artists[0].name === 'Vae' || songs[i].artists[0].name === 'vae' || songs[i].artists[0].name === 'VAE') {
              songId = songs[i].id;
              _this.setData({
                'songUrl': 'https://music.163.com/song/media/outer/url?id=' + songId + '.mp3'
              })
              backgroundAudioManager.title = songs[i].name;
              backgroundAudioManager.epname = songs[i].album.name;
              backgroundAudioManager.singer = songs[i].artists[0].name;
              backgroundAudioManager.duration = songs[i].duration / 1000;
              backgroundAudioManager.webUrl = 'https://music.163.com/song/media/outer/url?id=' + songId + '.mp3';

              _this.setData({
                ["songInfo.singer"]: songs[i].artists[0].name,
                ["songInfo.songName"]: songs[i].name
              });
              _this.getSongInfo(songId);
            }
          }
        }
      }
    })
  },
  getSongInfo(songId) {
    let _this = this;
    wx.request({
      url: baseUrl + '/song/detail?ids=' + songId,
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songs = data.songs;
          let songImgUrl = songs[0].al.picUrl;
          backgroundAudioManager.coverImgUrl = songImgUrl;
          _this.setData({
            ["songInfo.imgUrl"]: songImgUrl
          })
          wx.hideLoading()
        }
      }
    })
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
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