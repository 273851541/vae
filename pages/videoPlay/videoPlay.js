// pages/videoPlay/videoPlay.js
import url from '../../utils/baseUrl.js';
import Dialog from '../../dist/dialog/dialog';
var videoAd = null;
var downloadTask = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    imgurl16v9: '',
    duration: 0,
    videoUrl: '',
    name: '',
    // id: 10925701,
    // imgurl16v9: 'http://p1.music.126.net/x7j7N5pbjH7jBIddQ2gdNg==/109951164882944905.jpg',
    // duration: 214000,
    // videoUrl:'http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/2089512768/5db53a989d6b8d4fd1ec87a3849c4289.mp4?wsSecret=a17d5c86d2a048698ce0ab9773d75e59&wsTime=1589461948',
    // name:'全世界最好的你',
    relatedVideoData: [],
    unitId: "adunit-1bb66fc674971e63",
    isLookAD: true,
    progress: 0,
    downlaodNum: 0,
    showOverlay: false,
    showLink:false,
    gradientColor: {
      '0%': '#74ebd5',
      '100%': '#ACB6E5',
    }
  },

  onAdplay(e) {
    console.log('onAdplay', e)
  },
  onAdload(e) {
    console.log('onAdload', e)
  },
  onAdclose(e) {
    console.log('onAdclose', e)
  },
  onAdError(e) {
    console.log('onAdError', e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      id: options.id,
      imgurl16v9: decodeURIComponent(options.imgurl16v9),
      duration: options.duration,
      name: options.name,
      videoUrl: decodeURIComponent(options.videoUrl)
    })
    this.getAllVideo(options.id);
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.createAd();
  },

  createAd() {
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-4122a3cf6e3c11dd'
      })
      videoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      videoAd.onError((err) => {
        console.log(err)
      })
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          console.log("正常播放结束");
          this.setData({
            isLookAD: true,
            downlaodNum: 0
          })
          this.downloadVideo();
        } else {
          console.log("中途退出啦")
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let videoContext = wx.createVideoContext(`mvVideo-${this.data.id}`);
    videoContext.play();
  },

  getAllVideo(id) {
    let _this = this;
    wx.request({
      url: url.relatedVideo + '?id=' + id,
      success(res) {
        console.log(res)
        if (res.data.code === 200) {
          let data = res.data.data;
          data.map(s => {
            s.durationms = _this.formatSeconds(parseInt(s.durationms / 1000))
          })
          _this.setData({
            relatedVideoData: data
          })
        }
      }
    })
  },

  playVideo(e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })
    let _this = this;
    wx.request({
      url: url.videoUrl + '?id=' + id,
      success: function (res) {
        if (res.data.code === 200) {
          let urls = res.data.urls[0];
          let relatedVideoData = _this.data.relatedVideoData;
          relatedVideoData.map(s => {
            if (s.vid === id) {
              _this.setData({
                videoUrl: urls.url,
                name: s.title,
                duration: s.durationms,
                imgurl16v9: s.coverUrl,
                id: urls.id
              })
              wx.setNavigationBarTitle({
                title: s.title
              })
              _this.getAllVideo(urls.id)
            }
          })
        }
        wx.hideLoading()
      }
    })
  },

  getWritePhotosAlbum() {
    let _this = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用相册功能，后续调用 wx.startRecord 接口不会弹窗询问
              _this.showDownload()
            }
          })
        }else{
          _this.showDownload()
        }
      }
    })

  },

  showDownload() {
    let _this = this;
    if (this.data.isLookAD && this.data.downlaodNum < 4) {

      this.downloadVideo();
      // downloadTask.abort() // 取消下载任务
    } else {
      Dialog.confirm({
          title: '提示',
          message: '亲~看个广告支持下呗( ･´ω`･ )',
          confirmButtonText: "支持你",
          cancelButtonText: "我就不"
        })
        .then(() => {
          // 用户触发广告后，显示激励视频广告
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => {
                  videoAd.show()
                })
                .catch(err => {
                  console.log('激励视频 广告显示失败')
                })
            })
          }
        })
        .catch(() => {});
    }
  },

  downloadVideo() {
    let _this = this;
    this.setData({
      showOverlay: true,
      downlaodNum: this.data.downlaodNum++
    })
    downloadTask = wx.downloadFile({
      url: _this.data.videoUrl,
      success: function (res) {
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存成功",res)
            _this.setData({
              progress: 0,
              showOverlay: false
            })
          },
          fail(res) {
            console.log("保存失败",res)
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        })
        console.log("下载文件调用接口", res)
      },
      fail(err){
        _this.setData({
          showLink:true
        })
        downloadTask.abort();
        console.log(err)
      }
    })
    downloadTask.onProgressUpdate((res) => {
      _this.setData({
        progress: res.progress
      })
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },

  cancelDownload() {
    this.setData({
      showOverlay: false
    })
    wx.showToast({
      title: '下载已取消',
      icon: 'none'
    })
    console.log('下载已取消')
    downloadTask.abort();
  },

  copyLink(){
    wx.setClipboardData({
      data: this.data.videoUrl
    })
  },

  formatSeconds(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

    let res = '';
    if (h !== '00') res += `${h}:`;
    if (m !== '00') res += `${m}:`;
    res += `${s}`;
    return res;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    return {
      title: this.data.name,
      path: '/page/videoPlay/videoPlay?id=' + this.data.id + '&imgurl16v9=' + encodeURIComponent(this.data.imgurl16v9) + '&duration=' + (this.data.duration) + '&videoUrl=' + encodeURIComponent(this.data.videoUrl) + '&name=' + (this.data.name)
    }

    console.log()
  }
})