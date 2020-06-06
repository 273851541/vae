import url from '../../utils/baseUrl.js'

import tools from '../../utils/tools'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    mvList: [],
    pageIndex1: 0,
    pageIndex2: 0,
    currentType: 0,
    currentSwiperId: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })

    this.getMVList(this.data.pageIndex1);

  },

  getVideoList(offset) {
    const _this = this;
    wx.request({
      url: url.searchVideo + '?keywords=许嵩&type=1014&limit=10&offset=' + (offset * 10),
      success: function (res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          let videos = data.result.videos;
          if (videos.length > 0) {
            let videoList = _this.data.videoList;
            videos.map((s,index) => {
              s.videoUrl = '';
              s.videoPlayStatus = false;
              if(index%5===0){
                if(offset>0||(offset===0&&index>0)){
                  videos.splice(index,0,{
                    flag:true
                  })
                }
              }
            })

            videoList.push(...videos);
            offset = offset +1
            _this.setData({
              pageIndex2:offset,
              'videoList': videoList
            })
            wx.hideLoading();
          } else {
            _this.setData({
              pageIndex1: -1
            })
          }
        } else {
          wx.showToast({
            title: '数据获取失败',
          })
        }
      },
      fail: function () {
        // wx.showToast({
        //   title: '数据获取失败',
        // })
      }
    })
  },

  getMVList(offset) {
    const _this = this;
    wx.request({
      url: url.searchMV + '?id=5771&limit=10&offset=' + (offset * 10),
      success: function (res) {
        let data = res.data;
        console.log(data);
        if (data.code === 200) {
          let mvs = data.mvs
          if (mvs.length > 0) {
            let mvList = _this.data.mvList;
            mvs.map((s,index) => {
              s.videoUrl = '';
              s.videoPlayStatus = false;
              if(index%5===0){
                if(offset>0||(offset===0&&index>0)){
                  mvs.splice(index,0,{
                    flag:true
                  })
                }
              }
            })

            mvList.push(...mvs);
            offset = offset +1
            _this.setData({
              pageIndex1:offset,
              'mvList': mvList
            })
            wx.stopPullDownRefresh();
            wx.hideLoading();
          } else {
            _this.setData({
              pageIndex1: -1
            })
          }
        } else {
          // wx.showToast({
          //   title: '数据获取失败',
          // })
        }
      },
      fail: function () {
        // wx.showToast({
        //   title: '数据获取失败',
        // })
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
      success: function (res) {
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
    let videoUrl = mvListStr + "[" + hasVideoPlayIndex + "].videoUrl";
    let videoPlayStatus = mvListStr + "[" + hasVideoPlayIndex + "].videoPlayStatus";
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
    let videoUrl = mvListStr + "[" + videoIndex + "].videoUrl";

    let videoUrlStr = '';
    if (this.data.currentSwiperId == 0) {
      videoUrlStr = data.data.url || "";
    } else {
      videoUrlStr = data.urls[0].url
    }
    this.setData({
      [videoUrl]: videoUrlStr,
    })

    console.log(videoPlayList);
    wx.navigateTo({
      url: '../videoPlay/videoPlay?id=' + (videoPlayList.id||videoPlayList.vid) + '&imgurl16v9=' + encodeURIComponent(videoPlayList.imgurl16v9||videoPlayList.coverUrl) + '&duration=' + (videoPlayList.duration||videoPlayList.durationms) + '&videoUrl=' + encodeURIComponent(videoPlayList.videoUrl) + '&name=' + (videoPlayList.name || videoPlayList.title)
    })

  },

  scrollTolower(e) {
    if(this.data.currentSwiperId==0){
      if (this.data.mvList.length === -1) {
        return false;
      }
      this.getMVList(this.data.pageIndex1)
    }else if(this.data.currentSwiperId==1){
      if (this.data.videoList.length === -1) {
        return false;
      }
      this.getVideoList(this.data.pageIndex2)
    }
  },

  //点击切换tab
  clickTab(event) {
    this.stopPlayVideo();
    let current = event.currentTarget.dataset.current;
    this.setData({
      currentSwiperId: current
    })
    if (current == 1) {
      if (this.data.videoList.length === 0) {
        this.getVideoList(0);
      }
    }
  },


  //swiper滑动改变current事件
  bindchange(event) {
    let current = event.detail.current;
    if (event.detail.source === 'touch') {
      if (current == 1 && this.data.videoList.length === 0) {
        this.getVideoList(this.data.pageIndex2);
      }
      this.setData({
        currentSwiperId: current
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})