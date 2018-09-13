//index.js
//获取应用实例
const app = getApp()
const InnerAudioContext = wx.createInnerAudioContext();
const baseUrl = 'http://118.24.128.24:3000';
import url from '../../utils/baseUrl.js';

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
    InnerAudioContext.onPlay(() => {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
    })
    InnerAudioContext.onPause(() => {
      this.setData({
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
    })
    InnerAudioContext.onEnded(() => {
      this.setData({ 
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
      InnerAudioContext.src=" "
    })
    InnerAudioContext.onWaiting(() => {
      this.setData({
        playStatus: "loading",
        playImg: '../../utils/src/loading.png'
      });
    })
    InnerAudioContext.onCanplay(() => {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
    })
    InnerAudioContext.onStop(() => {
      this.setData({
        playStatus: false,
        playImg: '../../utils/src/play.png'
      });
      InnerAudioContext.src = " "
    })
    // InnerAudioContext.onError(() => {
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
      InnerAudioContext.pause();
    } else {
      this.setData({
        playStatus: true,
        playImg: '../../utils/src/pause.png'
      })
      if (!InnerAudioContext.src || InnerAudioContext.src===" ") {
        InnerAudioContext.src = this.data.songUrl;
        InnerAudioContext.play();
      }else{
        InnerAudioContext.play();
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
      url: url.search + '?keywords=' + songName + '&limit=5',
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songs = data.result.songs;
          let songId;
          console.log(songs);
          for (let i in songs) {
            if (songs[i].artists[0].name === '许嵩' || songs[i].artists[0].name === 'Vae' || songs[i].artists[0].name === 'vae' || songs[i].artists[0].name === 'VAE' || songs[i].artists[0].name === 'V') {
              songId = songs[i].id;
              _this.setData({
                'songUrl': url.songUrl+'?id=' + songId + '.mp3'
              })
              // InnerAudioContext.title = songs[i].name;
              // InnerAudioContext.epname = songs[i].album.name;
              // InnerAudioContext.singer = songs[i].artists[0].name;
              // InnerAudioContext.duration = songs[i].duration / 1000;
              // InnerAudioContext.webUrl = url.songUrl+'?id=' + songId + '.mp3';

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
      url: url.songDetail + '?ids=' + songId,
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songs = data.songs;
          let songImgUrl = songs[0].al.picUrl;
          InnerAudioContext.coverImgUrl = songImgUrl;
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