let baseUrl = "http://118.24.128.24:3000"
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    playList:[],
    songInfo: {},
    playStatus: true,
    progress: 0,
    currentPosition: '00:00',
    duration: '00:00',
    lyric: [],
    current_lyric: 0,
    isFullScreenLyric: false,
    autoHeight: 0,
    currentScroll_FullScreen: 0,
    currentScroll_NoFullScreen: 0,
    currentTime:0,
    currentTimeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    wx.showLoading({
      title: 'LOADING',
    })
    let id = options.id;
    this.setData({
      id: id
    })
    // let id = 865460478;
    this.getSongInfo(id);
    this.getLyric(id);
    this.getPlayList();
    this.songPlay();
    backgroundAudioManager.onPlay(() => {
      this.setData({
        playStatus: false
      })
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        playStatus: true
      })
    })
    backgroundAudioManager.onEnded(() => {
      this.setData({
        playStatus: true
      })
      this.autoPlayNext()
       
      // if(this.data.playList.length===0){
      // }else{
      //   this.autoPlayNext();
      // }

    })

    console.log(backgroundAudioManager.duration)
    console.log(backgroundAudioManager.currentTime)
    console.log(backgroundAudioManager.src)


  },

  // 获取歌曲列表
  getPlayList() {
    let _this = this;
    wx.request({
      url: baseUrl + '/playlist/detail?id=2384283232',
      success: function (res) {
        let data = res.data;
        if (data.code === 200) {
          let playList = data.playlist.tracks.reverse();
          console.log(playList);
          _this.setData({
            playList: playList
          })
          
        }
      }
    })
  },

  //上一曲
  playPrev(){
    let currentPlay = this.data.songInfo;
    let playList = this.data.playList;
    let nextIndex;
    nextIndex = playList.findIndex(item => {
      return item.id === currentPlay.id
    })
    if (nextIndex === 0) {
      nextIndex = playList.length - 1;
    } else {
      nextIndex--
    }
    this.backgroundAudioManagerHandler(playList[nextIndex])
    backgroundAudioManager.src = 'https://music.163.com/song/media/outer/url?id=' + playList[nextIndex].id + '.mp3';

    this.setData({
      currentScroll_FullScreen: 0,
      currentScroll_NoFullScreen:0
    })
  },

//自动下一曲
  autoPlayNext() {
    let currentPlay = this.data.songInfo;
    let playList = this.data.playList;
    let nextIndex;
    nextIndex = playList.findIndex(item => {
      return item.id === currentPlay.id
    })
    if (nextIndex === playList.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex++
    }
    this.backgroundAudioManagerHandler(playList[nextIndex])
    backgroundAudioManager.src = 'https://music.163.com/song/media/outer/url?id=' + playList[nextIndex].id + '.mp3';

    this.setData({
      currentScroll_FullScreen: 0,
      currentScroll_NoFullScreen:0
    })
  },

//背景播放器赋值
  backgroundAudioManagerHandler(songInfo) {

    this.setData({
      'songInfo': songInfo
    })
    this.getLyric(songInfo.id);
    console.log(songInfo)
    this.setData({
      'playStatus': false
    })
    backgroundAudioManager.title = songInfo.name;
    backgroundAudioManager.epname = songInfo.al.name;
    backgroundAudioManager.singer = songInfo.ar[0].name;
    backgroundAudioManager.duration = songInfo.dt / 1000;
    backgroundAudioManager.webUrl = 'https://music.163.com/song/media/outer/url?id=' + songInfo.id + '.mp3';
  },

  //开始播放歌曲
  songPlay: function() {
    var _this = this;
    clearInterval(timer);
    var timer = setInterval(function() {
      wx.getBackgroundAudioPlayerState({
        success: function(res) {
          // success

          let currentPosition = res.currentPosition
          let duration = res.duration

          if (res.status == 1) {
            _this.setData({
              playStatus: false
            });
            _this.lyricMove(currentPosition)
          } else {
            _this.setData({
              playStatus: true
            });
            if (res.status == 2) {
              console.log('没有在播放')
              // backgroundAudioManager.src = 'http://music.163.com/song/media/outer/url?id=' + this.data.id + '.mp3';
            }
          }
          _this.setData({
            duration: _this.timeToString(backgroundAudioManager.duration),
            currentPosition: currentPosition ? _this.timeToString(currentPosition) : "00:00",
            currentTime: currentPosition || 0,
            progress: currentPosition / duration * 100,
          })
          if (_this.data.currentTimeIndex === 0) {
            _this.autoPositionLyric(_this.data.currentTime);
            _this.setData({
              currentTimeIndex:1
            })
          }
        },
        fail: function(res) {
          // fail
          console.log(res)
        },
        complete: function(res) {
          // complete
        }
      })
    }, 1000)

  },

  play() {
    backgroundAudioManager.play();
  },

  pause() {
    backgroundAudioManager.pause();
  },

  // 时间转换
  timeToString: function(s) {
    var t = '';
    if (s > -1) {
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;

      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += parseInt(sec);
    }
    return t;
  },


  // 获取歌曲信息
  getSongInfo(songId) {
    let _this = this;
    wx.request({
      url: baseUrl + '/song/detail?ids=' + songId,
      success: function(res) {
        let data = res.data;
        if (data.code === 200) {
          let songInfo = data.songs[0];
          _this.setData({
            "songInfo": songInfo
          })
          wx.hideLoading()
        }
      }
    })
  },


  // 获取歌词
  getLyric(id) {
    let _this = this;
    wx.request({
      url: baseUrl + '/lyric?id=' + id,
      success: function(res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          let lyric = _this.parseLyric(data.lrc.lyric);
          console.log(lyric);
          _this.setData({
            lyric: lyric
          })
        }
      }
    })

  },


  // 歌词解析
  parseLyric: function(lrc) {
    let lyrics = lrc.split("\n");
    let lrcObj = [];
    for (let i = 0; i < lyrics.length; i++) {
      let lyric = decodeURIComponent(lyrics[i]);
      let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      let timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      let clause = lyric.replace(timeReg, '');
      for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
        let t = timeRegExpArr[k];
        let min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*/i)).slice(1));
        let time = min * 60 + sec;
        if (clause) {

          lrcObj.push({
            time: time,
            word: clause
          })
        }

      }
    }

    function compare(property) {
      return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;     // 升序
      }
    }
    var sortObj = lrcObj.sort(compare("time"));
    return sortObj;
  },

  // 歌词滚动

  lyricMove: function(currentPosition) {

    let lyric = this.data.lyric;
    for (let i = 0; i < lyric.length; i++) {
      if (lyric[i].time === currentPosition) {
        this.setData({
          current_lyric: lyric[i].time
        })

        if (this.data.isFullScreenLyric) {

          if (lyric[i].time >= this.data.lyric[6].time) {
            this.setData({
              currentScroll_FullScreen: (i - 5) * 40
            })
          }else{
            this.setData({
              currentScroll_FullScreen: 0
            })
          }

        } else {
          if (lyric[i].time >= this.data.lyric[2].time) {
            this.setData({
              currentScroll_NoFullScreen: (i - 1) * 40
            })
          }else{
            this.setData({
              currentScroll_FullScreen: 0
            })
          }
        }
      }
    }
  },

  // 滚动
  scrollHandle: function() {},

  //全屏歌词模式
  fullScreenLyric() {
    let _this = this;
    var query = wx.createSelectorQuery()
    query.select('.playerView').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      // #the-id节点的上边界坐标
      console.log(res);
      _this.setData({
        autoHeight: res[0].top
      })
    })

    let isFullScreenLyric = this.data.isFullScreenLyric;
    this.setData({
      isFullScreenLyric: !isFullScreenLyric
    })
    this.autoPositionLyric(this.data.current_lyric)
  },


  autoPositionLyric(current_lyric) {
    let lyric = this.data.lyric;
    for (let i = 0; i < lyric.length; i++) {
      if (lyric[i].time > current_lyric) {
        if (this.data.isFullScreenLyric) {
          if (i > 6) {
            this.setData({
              currentScroll_FullScreen: (i - 6) * 40,
            })
          } else {
            this.setData({
              currentScroll_FullScreen: 0
            })
          }
          break;
        } else {
          if (i > 2) {
            this.setData({
              currentScroll_NoFullScreen: (i - 2) * 40
            })
          } else {
            this.setData({
              currentScroll_FullScreen: 0
            })
          }
          break;
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
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