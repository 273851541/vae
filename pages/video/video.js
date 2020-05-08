import url from '../../utils/baseUrl.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    mvList: [],
    pageIndex: 0,
    currentType: 0,
    currentSwiperId: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })

    this.getMVList(this.data.pageIndex);

  },

  getVideoList(offset) {
    const _this = this;
    wx.request({
      url: url.searchVideo + '?keywords=许嵩&type=1014&limit=10&offset=' + (offset * 10),
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
      url: url.searchMV + '?id=5771&limit=10&offset=' + (offset * 10),
      success: function(res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          if (data.mvs.length > 0) {
            let mvList = _this.data.mvList;
            data.mvs.map(item => {
              item.videoUrl = '';
              item.videoPlayStatus = false;
            })
            mvList.push(...data.mvs);

            _this.setData({
              'mvList': mvList
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

  getMVUrl(event) {
    let vid = event.currentTarget.dataset.id;
    let urlStr = "";
    if (this.data.currentSwiperId == 0) {
      urlStr = url.mvUrl + '?id=' + vid
    } else {
      urlStr = url.videoUrl + '?id=' + vid
    }
    let _this = this;
    wx.request({
      url: urlStr,
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

    let mvList = [];
    let mvListStr = '';
    if (this.data.currentSwiperId == 0) {
      mvList = this.data.mvList;
      mvListStr = 'mvList';
    } else {
      mvList = this.data.videoList;
      mvListStr = 'videoList';
    }

    let hasVideoPlayIndex = mvList.findIndex(item => {
      return item.videoPlayStatus === true
    });
    let hasVideoPlayList = mvList.find(item => {
      return item.videoPlayStatus === true
    });
    if (hasVideoPlayIndex < 0 || hasVideoPlayList < 0) {
      return false;
    }
    console.log('关闭了一个视频');
    let videoUrl = mvListStr+"[" + hasVideoPlayIndex + "].videoUrl";
    let videoPlayStatus = mvListStr+"[" + hasVideoPlayIndex + "].videoPlayStatus";
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

    let mvList = [];
    let mvListStr = '';
    if (this.data.currentSwiperId == 0) {
      mvList = this.data.mvList;
      mvListStr = 'mvList';
    } else {
      mvList = this.data.videoList;
      mvListStr = 'videoList';
    }
    let videoIndex = mvList.findIndex(item => {
      return item.id === vid || item.vid === vid
    });
    let videoPlayList = mvList.find(item => {
      return item.id === vid || item.vid === vid
    });
    let videoUrl = mvListStr+"[" + videoIndex + "].videoUrl";

    let videoUrlStr = '';
    if (this.data.currentSwiperId == 0) {
      videoUrlStr = data.data.url||"";
    } else {
      videoUrlStr = data.urls[0].url
    }
    this.setData({
      [videoUrl]: videoUrlStr,
    })

    console.log(videoPlayList);
    // let sendList = {
    //   id:videoPlayList.id,
    //   imgurl16v9:videoPlayList.imgurl16v9,
    //   duration:videoPlayList.duration
    // }
    wx.navigateTo({
      url: '../videoPlay/videoPlay?id='+videoPlayList.id+'&imgurl16v9='+encodeURIComponent(videoPlayList.imgurl16v9)+'&duration='+videoPlayList.duration+'&videoUrl='+encodeURIComponent(videoPlayList.videoUrl)+'&name='+videoPlayList.name
    })

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
      if (this.data.currentSwiperId==0){
        this.getMVList(pageIndex + 1);
      }else{
        this.getVideoList(pageIndex + 1);
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 0,
      mvList: []
    })
    this.getMVList(this.data.pageIndex);
    console.log(123456)
  },


  //点击切换tab
  clickTab(event) {
    this.stopPlayVideo();
    let current = event.currentTarget.dataset.current;
    if (current == 1) {
      if (this.data.videoList.length === 0) {
        this.getVideoList(0);
      }
    }
    this.setData({
      pageIndex:0,
      currentSwiperId: current
    })
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