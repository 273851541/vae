const baseUrl = 'http://118.24.128.24:3000';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    pageIndex: 0,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })
    // this.getVideoList();
    this.getMVList(this.data.pageIndex);

  },

  getVideoList() {
    const _this = this;
    wx.request({
      url: baseUrl + '/search?keywords=许嵩&type=1014&limit=10&offset=0',
      success: function(res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          if (data.result.videos.length > 0) {
            let videoList = _this.data.videoList;
            data.result.videos.map(item => {
              item.videoUrl = '';
              item.videoPlayStatus = false;
            })
            videoList.push(...data.result.videos);

            _this.setData({
              'videoList': videoList
            })
            wx.hideLoading();
          }
        } else {
          wx.showToast({
            title: '数据获取失败',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '数据获取失败',
        })
      }
    })
  },

  getMVList(offset) {
    const _this = this;
    wx.request({
      url: baseUrl + '/artist/mv?id=5771&limit=10&offset=' + (offset * 10),
      success: function(res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          if (data.mvs.length > 0) {
            let videoList = _this.data.videoList;
            data.mvs.map(item => {
              item.videoUrl = '';
              item.videoPlayStatus = false;
            })
            videoList.push(...data.mvs);

            _this.setData({
              'videoList': videoList
            })
            wx.stopPullDownRefresh();
            wx.hideLoading();
          } else {
            _this.setData({
              pageIndex: -1
            })
          }
        } else {
          wx.showToast({
            title: '数据获取失败',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '数据获取失败',
        })
      }
    })
  },

  getVideoUrl(event) {
    let vid = event.currentTarget.dataset.id;
    let _this = this;
    wx.request({
      url: baseUrl + '/mv?mvid=' + vid,
      success: function(res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {


          _this.stopPlayVideo()
          _this.startPlayVideo({
            vid,
            data
          })
        }
      }
    })
  },

  stopPlayVideo() {
    let hasVideoPlayIndex = this.data.videoList.findIndex(item => {
      return item.videoPlayStatus === true
    });
    let hasVideoPlayList = this.data.videoList.find(item => {
      return item.videoPlayStatus === true
    });
    if (hasVideoPlayIndex < 0) {
      return false;
    }
    console.log('关闭了一个视频');
    let videoUrl = "videoList[" + hasVideoPlayIndex + "].videoUrl";
    let videoPlayStatus = "videoList[" + hasVideoPlayIndex + "].videoPlayStatus";
    this.setData({
      [videoUrl]: '',
      [videoPlayStatus]: false,
    })
    let videoContext = wx.createVideoContext(`mvVideo-${hasVideoPlayList.id}`);
    videoContext.stop();
  },

  startPlayVideo({
    vid,
    data
  }) {
    let videoIndex = this.data.videoList.findIndex(item => {
      return item.id === vid
    });
    let videoUrl = "videoList[" + videoIndex + "].videoUrl";
    let videoPlayStatus = "videoList[" + videoIndex + "].videoPlayStatus";
    this.setData({
      [videoUrl]: data.data.brs[720] || data.data.brs[480] || data.data.brs[240],
      [videoPlayStatus]: true,
    })
    let videoContext = wx.createVideoContext(`mvVideo-${vid}`);
    videoContext.play();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('到底了');
    if (this.data.pageIndex < 0) {
      return false;
    }
    let pageIndex = this.data.pageIndex++;
    console.log(pageIndex);
    if (pageIndex >= 0) {
      this.getMVList(pageIndex + 1);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex:0,
      videoList:[]
    })
    this.getMVList(this.data.pageIndex);
    console.log(123456)
  },


  bindended() {

  },

  bindplay(event) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})