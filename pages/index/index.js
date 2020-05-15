//index.js
//获取应用实例
const app = getApp()
const InnerAudioContext = wx.createInnerAudioContext();
const baseUrl = 'http://118.24.128.24:3000';
import url from '../../utils/baseUrl.js';
var BaaS_query = new wx.BaaS.Query()
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
    },
    currentParentSwiperId: 0,
    currentChildSwiperId:"0",
    traceDataPage: 1,
    blogDataPage:0,
    traceData: [],
    blogData: [],
    swiperStatus: true,
    Oneheight: 0
  },
  onLoad: function () {
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })
    this.getTodayHeight();
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
      InnerAudioContext.src = " "
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
      if (!InnerAudioContext.src || InnerAudioContext.src === " ") {
        InnerAudioContext.src = this.data.songUrl;
        InnerAudioContext.play();
      } else {
        InnerAudioContext.play();
      }
    }
  },
  getTodayData() {
    let tableId = 'today';
    let MyTableObject = new wx.BaaS.TableObject(tableId);
    MyTableObject.setQuery(BaaS_query).limit(1).offset(Math.floor(Math.random() * 5)).find().then(res => {
      // success
      console.log(res.data);
      let data = res.data.objects[0]
      if(res.data.objects.length>0){
        this.setData({
          'content': data.content,
          ['songInfo.songName']: data.songName,
          ['songInfo.singer']: data.singer,
        })
        this.getSearchSong(data.songName);
      }else{
        wx.showToast({
          icon:'none',
          title: '暂无数据',
        })
      }

    }, err => {
      // err
    })
  },
  getSearchSong(songName) {
    let _this = this;
    wx.request({
      url: url.search + '?keywords=' + songName + '&limit=5',
      success: function (res) {
        let data = res.data;
        if (data.code === 200) {
          let songs = data.result.songs;
          let songId;
          console.log(songs);
          for (let i in songs) {
            if (songs[i].artists[0].name === '许嵩' || songs[i].artists[0].name === 'Vae' || songs[i].artists[0].name === 'vae' || songs[i].artists[0].name === 'VAE' || songs[i].artists[0].name === 'V') {
              songId = songs[i].id;
              _this.setData({
                'songUrl': url.songUrl + '?id=' + songId + '.mp3'
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
      success: function (res) {
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
      },fail() {
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }
    })
  },
  getTraceData(page) {
    if(page==1){
      wx.showLoading({
        title: 'LOADING',
        mask: true
      })
    }
    let _this = this;
    wx.request({
      url: url.traceList + '?pageSize=20&page=' + page,
      success({ data }) {
        if (data.state) {
          if (data.result.activityInfo.length > 0) {
            let traceData = _this.data.traceData;
            let activityInfo = data.result.activityInfo;
            activityInfo.map(s=>{
              if(_this.dateDiff(s.startTime)>0){
                s.dateDiff = true
              }else{
                s.dateDiff = false
              }
            })

            traceData.push(...data.result.activityInfo);
            page = page +1
            _this.setData({
              traceDataPage: page,
              traceData: traceData
            })
          }else{   
            _this.setData({
              traceDataPage: 0
            })
          }
        }
        wx.hideLoading();
      },
      fail() {
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }
    })
  },
  getBlogData(page){
    if(page==0){
      wx.showLoading({
        title: 'LOADING',
        mask: true
      })
    }
    let tableId = 99412;
    let MyTableObject = new wx.BaaS.TableObject(tableId);
    let offset = page*10;
    MyTableObject.limit(30).offset(offset).find().then(res => {
      // success
      console.log("博客",res.data);
      let data = res.data.objects

      if (data.length > 0) {
        let blogData = this.data.blogData;
        blogData.push(...data);
        page = page + 1
        this.setData({
          blogDataPage: page,
          blogData: blogData
        })
      }else{
        this.setData({
          blogDataPage: -1
        })
      }

      wx.hideLoading();
    }, err => {
      // err
    })
  },

  toTraceContont(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../traceContont/traceContont?id=' + id,
    })
  },

  toBlogContont(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../blogContont/blogContont?id=' + id+"&name=" + name,
    })
  },

  parentSwiperChange(e){
    let current = e.detail.current;
    if (current == 1 && this.data.blogData.length === 0) {
      this.getBlogData(this.data.blogDataPage);
    }
    this.setData({
      currentParentSwiperId:current
    })
  },

  dateDiff: function(sDate2) {
    let strSeparator = "-";
    let strDateArrayStart;
    let strDateArrayEnd;
    let intDay;
    let sDate1 = this.currentTime()
    // let sDate1 = '2020-01-01'
    strDateArrayStart = sDate1.split(strSeparator);
    strDateArrayEnd = sDate2.split(strSeparator);
    let strDateS = new Date(
      strDateArrayStart[0] +
      "/" +
      strDateArrayStart[1] +
      "/" +
      strDateArrayStart[2]
    );
    let strDateE = new Date(
      strDateArrayEnd[0] + "/" + strDateArrayEnd[1] + "/" + strDateArrayEnd[2]
    );
    intDay = (strDateE - strDateS) / (1000 * 3600 * 24);
    return intDay;
  },
  currentTime: function() {
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate(); 

    let clock = year + "-";

    if (month < 10) clock += "0";

    clock += month + "-";

    if (day < 10) clock += "0";

    clock += day + " ";

    return clock;
  },


  //swiper滑动改变current事件
  bindchange(event) {
    let current = event.detail.current;
    if (event.detail.source === 'touch') {
      if (current == 1 && this.data.traceData.length === 0) {
        this.getTraceData(this.data.traceDataPage);
      }
      this.setData({
        currentChildSwiperId: current
      })
    }
  },

  getTodayHeight() {
    let query = wx.createSelectorQuery();
    //选择id
    let that = this;
    let One, pulltopstyle,operaBox;
    query.select('.title').boundingClientRect(function (rect) {
      One = rect.height;
    }).exec();
    query.select('.pulltopstyle').boundingClientRect(function (rect) {
      pulltopstyle = rect.height;
    }).exec();
    query.select('.operaBox').boundingClientRect(function (rect) {
      operaBox = rect.height;
    }).exec();
    query.select('.swiperClass').boundingClientRect(function (res) {
      that.setData({
        Oneheight: (res.height - One - pulltopstyle - operaBox - 25 ) + 'px'
      })
    }).exec();
  },

  //点击切换tab
  clickTab(event) {
    let current = event.currentTarget.dataset.current;
    if (current == 1 && this.data.traceData.length === 0) {
      this.getTraceData(this.data.traceDataPage);
    }
    this.setData({
      currentChildSwiperId: current
    })
  },

  scrollTolower(e) {
    if(this.data.currentChildSwiperId==0){
      if (this.data.blogDataPage === -1) {
        return false;
      }
      this.getBlogData(this.data.blogDataPage)
    }else if(this.data.currentChildSwiperId==1){
      if (this.data.traceDataPage === 0) {
        return false;
      }
      this.getTraceData(this.data.traceDataPage)
    }
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