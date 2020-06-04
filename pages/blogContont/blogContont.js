// pages/traceContont/traceContont.js\
import url from '../../utils/baseUrl.js';
var WxParse = require('../../utils/wxParse/wxParse');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {}
  },


  getBlogContontList(id) {
    wx.showLoading({
      title: 'LOADING',
    })

    let _this = this;
     wx.request({
      url: 'https://www.vaecn.club/blog_html/'+(id-1)+'.html',
      success({data}){
        WxParse.wxParse('article', 'html', data, _this, 0);
        wx.hideLoading()
      },
      fail() {
        wx.showToast({
          title: '请求失败',
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogContontList(options.id);
    wx.setNavigationBarTitle({
      title:options.name
    })
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

  }
})