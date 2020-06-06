//index.js
//获取应用实例
const app = getApp()
const InnerAudioContext = wx.createInnerAudioContext();
const baseUrl = 'http://118.24.128.24:3000';
import url from '../../utils/baseUrl.js';
var BaaS_query = new wx.BaaS.Query();
var Poster = requirePlugin('poster');
var interstitialAd = null

var songName = {
  text: '',
  x: 360,
  y: 0,
  fontSize: 24,
  color: '#5e5e5e',
  opacity: 1,
  lineHeight: 60,
  lineNum: 1,
  width: 360,
  baseLine: 'middle',
  textAlign: 'center',
};

var titileText = {
  text: '长按识别进入小程序',
  x: 300,
  y: 0,
  fontSize: 24,
  color: '#a8a8a8',
  opacity: 1,
  lineHeight: 60,
  lineNum: 1,
  width: 360,
  baseLine: 'middle',
  textAlign: 'center',
  'zIndex': 3
};

Page({
  data: {
    calendarsList: [],
    newsList: [],
    playStatus: false,
    playImg: '../../utils/src/play.png',
    songUrl: '',
    content: '你在北方某城 很偶尔下雨\n我在天南海北 很偶尔想你\n写不来十八九岁煽情字句\n孤单喂饱了理性。',
    songInfo: {
      imgUrl: '',
      songName: '',
      singer: '',
    },
    currentParentSwiperId: 0,
    currentChildSwiperId: "0",
    traceDataPage: 1,
    blogDataPage: 0,
    traceData: [],
    blogData: [],
    swiperStatus: true,
    Oneheight: 0,
    showPullTop: true,
    posterShow: false,
    popupShow: false,
    posterImage: "",
    InterstitialAd: false,
    posterConfig: {
      width: 720,
      height: 1080,
      backgroundColor: '#fff',
      debug: false,
      preload: true,
      texts: [],
      images: [{
          url: '',
          width: 690,
          height: 690,
          y: 15,
          x: 15,
        },
        {
          url: "https://cloud-minapp-18952.cloud.ifanrusercontent.com/1jhAMvL4m7KvIY8Z.jpg",
          width: 150,
          height: 150,
          y: 1100,
          x: 30,
        },
      ],
      lines: [{
        startX: 15,
        startY: 1,
        endX: 705,
        endY: 1,
        color: '#ccc',
        zIndex: 5
      }]

    }
  },
  onLoad: function () {
    let _this = this;
    wx.getStorage({
      key: 'userInfo',
      success({
        data
      }) {
        if (data && data.nickname) {
          _this.setData({
            showPullTop: false
          })
        }
      }
    })
    wx.BaaS.auth.loginWithWechat().then(user => {
      // 登录成功
      this.readyHandle();
    }, err => {
      wx.showToast({
        title: "code:" + err.code + " " + err.message
      })
    })
    this.getTodayHeight();
    this.loadAD();
  },

  loadAD() {
    // 在页面中定义插屏广告

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-37018f515a17693e'
      })
      interstitialAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {
        this.setData({
          InterstitialAd: true
        })
        console.log(this.data.InterstitialAd)
      })
    }
  },

  popupShowHandle() {
    this.setData({
      popupShow: true,
      swiperStatus: false
    })
  },

  // posterShowHandle(){
  //   this.setData({
  //     posterShow:true
  //   })
  // },

  onClose() {
    this.setData({
      popupShow: false,
      posterShow: false,
      swiperStatus: true
    })
  },

  onPosterSuccess(e) {
    const {
      detail
    } = e;
    // this.setData({
    //   posterShow:true,
    //   posterImage:detail
    // })

    wx.showToast({
      title: '长按保存或发送',
      duration: 1500,
      mask: true,
      success: function () {
        setTimeout(() => {
          wx.previewImage({
            current: detail,
            urls: [detail]
          })
        }, 1500)
      }
    })
  },

  onPostersss() {
    wx.showLoading({
      mask: true,
      title: '生成中'
    })
    const posterConfig = this.data.posterConfig;
    let posterSongContent = [];
    let songConent = this.data.content.split("\n");
    let songNames = songName;
    let titileTexts = titileText;
    let lyrictexts;
    let _this = this;
    wx.getImageInfo({
      src: _this.data.songInfo.imgUrl,
      success(res) {

        if (res.width === res.height) {
          posterConfig.images[0].url = _this.data.songInfo.imgUrl + "?param=700y700"; //封面的url
        } else {
          posterConfig.images[0].url = _this.data.songInfo.imgUrl; //封面的url
          posterConfig.images[0].height = res.height / (res.width / 690) //封面的高度
        }

        for (let i = 0; i < songConent.length; i++) {
          lyrictexts = {
            x: 30,
            y: posterConfig.images[0].height + 80,
            text: '',
            fontSize: 27,
            color: '#5e5e5e',
            opacity: 1,
            lineHeight: 35,
            lineNum: 5,
            width: 600,
          };

          if (i > 0) {
            lyrictexts.y += i * 50
          }
          lyrictexts.text = songConent[i];
          posterSongContent.push(lyrictexts)
        }

        songNames.y = lyrictexts.y + 90; //歌名的y位置
        songNames.text = _this.data.songInfo.singer + "《" + _this.data.songInfo.songName + "》" //歌名信息
        posterSongContent.push(songNames);

        posterConfig.lines[0].startY = songNames.y + 70; //横线的startY位置
        posterConfig.lines[0].endY = posterConfig.lines[0].startY + 1; //横线的endY位置

        posterConfig.images[1].y = posterConfig.lines[0].endY + 30; //二维码的y位置
        posterConfig.height = posterConfig.images[1].y + 180; //画布的高度
        titileTexts.y = posterConfig.images[1].y + 75 //title的y位置


        posterSongContent.push(titileTexts);

        posterConfig.texts = posterSongContent;
        _this.setData({
          posterConfig
        }, () => {
          _this.selectComponent('#poster').onCreate(true)
        })
      }
    })

  },

  onPosterFail(err) {
    console.error(err);
  },

  readyHandle() {
    wx.showLoading({
      title: 'LOADING',
      mask: true
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
      if (res.data.objects.length > 0) {
        this.setData({
          'content': data.content,
          ['songInfo.songName']: data.songName,
          ['songInfo.singer']: data.singer,
          ["songInfo.imgUrl"]: data.bgUrl,
          'songUrl': url.songUrl + '?id=' + data.songId + '.mp3'
        })
        InnerAudioContext.coverImgUrl = data.bgUrl;
        wx.hideLoading()
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无数据',
        })
      }

    }, err => {
      // err
    })
  },
  getTraceData(page) {
    if (page == 1) {
      wx.showLoading({
        title: 'LOADING',
        mask: true
      })
    }
    let _this = this;
    wx.request({
      url: url.traceList + '?pageSize=20&page=' + page,
      method:"POST",
      success({
        data
      }) {
        if (data.state) {
          if (data.result.activityInfo.length > 0) {
            let traceData = _this.data.traceData;
            let activityInfo = data.result.activityInfo;
            activityInfo.map(s => {
              if (_this.dateDiff(s.startTime) > 0) {
                s.dateDiff = true
              } else {
                s.dateDiff = false
              }
            })

            traceData.push(...data.result.activityInfo);
            page = page + 1
            _this.setData({
              traceDataPage: page,
              traceData: traceData
            })
          } else {
            _this.setData({
              traceDataPage: 0
            })
          }
        }
        wx.hideLoading();
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },
  getBlogData(page) {
    if (page == 0) {
      wx.showLoading({
        title: 'LOADING',
        mask: true
      })
    }
    let tableId = 99412;
    let MyTableObject = new wx.BaaS.TableObject(tableId);
    let offset = page * 10;
    MyTableObject.limit(30).offset(offset).find().then(res => {
      // success
      console.log("博客", res.data);
      let data = res.data.objects

      if (data.length > 0) {
        let blogData = this.data.blogData;
        blogData.push(...data);
        page = page + 1
        this.setData({
          blogDataPage: page,
          blogData: blogData
        })
      } else {
        this.setData({
          blogDataPage: -1
        })
      }

      wx.hideLoading();
    }, err => {
      // err
    })
  },

  toTraceContont(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../traceContont/traceContont?id=' + id,
    })
  },

  toBlogContont(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../blogContont/blogContont?id=' + id + "&name=" + name,
    })
  },

  parentSwiperChange(e) {
    let current = e.detail.current;
    if (current == 1 && this.data.traceData.length === 0) {
      this.getTraceData(this.data.traceDataPage);
    }
    if (!this.data.InterstitialAd&&current == 1) {
      setTimeout(() => {

        // 在适合的场景显示插屏广告
        if (interstitialAd) {
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
        }
      }, 2000)
    }
    this.setData({
      currentParentSwiperId: current
    })
  },

  dateDiff: function (sDate2) {
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
  currentTime: function () {
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
      if (current == 1 && this.data.blogData.length === 0) {
        this.getBlogData(this.data.blogDataPage);
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
    let One, pulltopstyle, operaBox;
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
        Oneheight: (res.height - One - (that.data.showPullTop ? pulltopstyle : 0) - operaBox - 30) + 'px'
      })
    }).exec();
  },

  //点击切换tab
  clickTab(event) {
    let current = event.currentTarget.dataset.current;
    if (current == 1 && this.data.blogData.length === 0) {
      this.getBlogData(this.data.blogDataPage);
    }
    this.setData({
      currentChildSwiperId: current
    })
  },

  scrollTolower(e) {
    if (this.data.currentChildSwiperId == 0) {
      if (this.data.traceDataPage === 0) {
        return false;
      }
      this.getTraceData(this.data.traceDataPage)
    } else if (this.data.currentChildSwiperId == 1) {
      if (this.data.blogDataPage === -1) {
        return false;
      }
      this.getBlogData(this.data.blogDataPage)
    }
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
    // console.log("onShow")
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

  /***
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "Vae",
      path: "/page/index",
      imageUrl: this.data.songInfo.imgUrl + "?param=700y700"
    }
  }
})