import url from '../../utils/baseUrl.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songInfo: {},
    duration: 0,
    currentTime: 0,
    currentTimeStr: '00:00',
    isTouchMove: false,
    playStatus: false,
    lyric: {
      '0': '正在获取歌词'
    },
    lyricArr: [],
    currentLrc: '',
    lyricPositionTop: 0,
    isFullScreen: false,
    attrIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let id = 1308081110;
    let id = options.id;
    this.getSongInfo(id);
    this.getLyric(id);
  },

  //上下一曲
  autoNextPlay(event) {
    let { musicList } = app.globalData;
    let currentId = this.data.songInfo.id;
    let nextIndex = musicList.findIndex(item => {
      return item.id === currentId;
    })
    let nextItemData;
    if (event && event.currentTarget.dataset.type==='prev'){
      if (nextIndex === 0) {
        nextItemData = musicList[musicList.length-1];
      } else {
        nextItemData = musicList[nextIndex - 1];
      }
    }else{
      if (nextIndex >= musicList.length - 1) {
        nextItemData = musicList[0];
      } else {
        nextItemData = musicList[nextIndex + 1];
      }
    }
    app.globalData.song = null;

    this.getSongInfo(nextItemData.id);
    this.getLyric(nextItemData.id);
  },


  //背景音乐赋值
  backgroundAudioManagerHandler(songInfo) {
    let {
      song
    } = app.globalData;
    if (!song) {
      song = app.globalData.song = wx.getBackgroundAudioManager();
      song.src = url.songUrl + '?id=' + songInfo.id + '.mp3';
      song.play();
      app.globalData.songInfo = songInfo
    }
    song.title = songInfo.name;
    song.epname = songInfo.al.name;
    song.singer = songInfo.ar[0].name;
    song.coverImgUrl = songInfo.al.picUrl
    song.duration = songInfo.dt / 1000;
    song.webUrl = url.songUrl+ '?id=' + songInfo.id + '.mp3';


    song.onTimeUpdate((res) => {
      if (this.data.duration !== song.duration) {
        this.setData({
          duration: song.duration,
          currentTime: song.currentTime
        })
      }
      if (!this.data.isTouchMove) {
        this.setData({
          currentTime: song.currentTime,
          currentTimeStr: this.timeToString(song.currentTime)
        })
      }
      let {
        currentTime: c
      } = song;

      let attr = this.timeToString(c);
      if (attr in this.data.lyric && attr !== this.data.currentLrc) {
        this.setData({
          currentLrc: attr
        })

        let attrIndex = this.data.lyricArr.findIndex(item => {
          return item.time === attr
        })
        this.setData({
          attrIndex
        })
        this.lyricPosition(attrIndex);
      }
    })

    song.onPlay(() => {
      this.setData({
        playStatus: false
      })
    })
    song.onPause(() => {
      this.setData({
        playStatus: true
      })
    })
    song.onEnded(() => {
      this.setData({
        playStatus: true
      })
      this.autoNextPlay()
    })
    song.onStop(() => {
      this.setData({
        playStatus: true
      })
    })
    song.onError(() => {
      wx.showToast({
        title: '播放错误',
      })
    })
    
  },

  //时间转换 
  timeToString(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return (min < 10 ? "0" + min : "" + min) + ":" + (sec < 10 ? "0" + sec : "" + sec);
  },

  //播放暂停
  play() {
    this.setData({
      playStatus: !this.data.playStatus
    })
    let {
      song
    } = app.globalData;
    song.paused ? song.play() : song.pause();
  },


  //拖动进度条过程中触发的事件
  changing() {
    this.setData({
      isTouchMove: true
    })
  },

  // 完成一次进度条拖动后触发的事件
  change(res) {
    let { song } = app.globalData
    if(!song) return;
    song.seek(res.detail.value);
    this.setData({
      isTouchMove: false,
      currentTime: res.detail.value
    })
    this.interludePosition(res.detail.value)

  },

  //间奏时的歌词定位
  interludePosition(time){
    let attrIndex = this.data.lyricArr.findIndex(item => {
      return item.time > this.timeToString(time)
    })
    if (attrIndex === -1) {
      attrIndex = this.data.lyricArr.length - 1
      this.setData({
        attrIndex,
        currentLrc: this.data.lyricArr[attrIndex].time
      })
    } else {

      if (attrIndex<1){
        this.setData({
          attrIndex,
          currentLrc: this.data.lyricArr[0].time
        })
      }else{
        this.setData({
          attrIndex,
          currentLrc: this.data.lyricArr[attrIndex - 1].time
        })
      }
    }


    this.lyricPosition(this.data.attrIndex, 1);
  },

  // 获取歌曲信息
  getSongInfo(songId) {
    let _this = this;
    wx.request({
      url: url.songDetail + '?ids=' + songId,
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songInfo = data.songs[0];
          _this.setData({
            "songInfo": songInfo
          })
          _this.backgroundAudioManagerHandler(songInfo)
          wx.hideLoading()
        }
      }
    })
  },

  // 获取歌词
  getLyric(id) {
    let _this = this;
    wx.request({
      url: url.lyric + '?id=' + id,
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let lyric = data.lrc.lyric;
          _this.parseLyric(lyric)
        }
      }
    })
  },

  // 歌词解析
  parseLyric: function(lrc) {
    let lyrics = lrc.split("\n");
    let lrcObj = [];
    let obj = {};
    let arr = [];
    for (let i = 0; i < lyrics.length; i++) {
      let lyric = decodeURIComponent(lyrics[i]);
      let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      let timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      let clause = lyric.replace(timeReg, '');
      for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
        let timerStr = timeRegExpArr[k].replace(/\[|]/g, '').substring(0, 5);
        let t = timeRegExpArr[k];
        let min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*/i)).slice(1));
        let time = min * 60 + sec;
        if (clause) {
          obj[timerStr] = clause;
          arr.push({
            time: timerStr,
            timeStr: time,
            word: clause,
            id:i
          });
        }

      }
    }

    function compare(property) {
      return function(obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2; // 升序
      }
    }
    let arrS = arr.sort(compare("timeStr"));
    this.setData({
      lyric: obj,
      lyricArr: arrS
    })
    
    setTimeout(()=>{
      this.interludePosition(this.data.currentTime)
    },500)
  },

  //计算歌词要到达的位置
  lyricPosition(attrIndex, type) {
    let _this = this
    var query = wx.createSelectorQuery()
    query.select('#scrollView').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      // #the-id节点的上边界坐标
      if(!res[0]) return;
      if (type && type === 1) {

        _this.setData({
          lyricPositionTop: (attrIndex * 40) - (res[0].height / 2)
        })
      } else {

        _this.setData({
          lyricPositionTop: (attrIndex * 40) - (res[0].height / 2) + 40
        })
      }

    })
  },

  //全屏幕歌词
  fullScreenLyric() {
    this.setData({
      isFullScreen: !this.data.isFullScreen
    })
    this.lyricPosition(this.data.attrIndex, 1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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