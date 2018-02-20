var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
var sliderWidth = 96;
Page({


  data: {
    apply_list: [],
    apply_set_list: [],
    has_more: true,
    has_set_more: true,
    page_index: 0,
    judgeApply: true,
    judgeSetApply: true,

    tabs: ["我收到的申请", "我发送的申请"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0
  },

 
  onLoad: function (options) {
    that = this;
    that.applyLoad();

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
        });
      }
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  applyLoad:function(){
    var page_size = 10;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    var querySetApply = new Bmob.Query(Apply);
    queryApply.descending('createdAt');
    queryApply.skip(that.data.page_index * page_size);
    queryApply.limit(page_size);
    queryApply.equalTo("getApplyUser", currentUserId);
    queryApply.equalTo("delete", false);
    queryApply.include("applyTeacher")

    querySetApply.descending('createdAt');
    querySetApply.skip(that.data.page_index * page_size);
    querySetApply.limit(page_size);
    querySetApply.equalTo("applyUser", currentUserId);
    querySetApply.equalTo("deleteSet", false);
    querySetApply.include("applyTeacherDetail")

    wx.showLoading({
      title: '加载中...',
    })
    queryApply.find({
      success: function (results) {
        wx.hideLoading()
        console.log(results);
        if (results.length == 0) {
          that.setData({
            judgeApply: false,
          });
        }
        else {
          var apply_list = that.data.apply_list;
          var teacherList = new Array();
          var applyTeacherList = new Array();
          for (var i = 0; i < results.length; i++) {
            teacherList[i] = results[i];
            applyTeacherList[i] = teacherList[i].get('applyTeacher')
          }
          that.setData({
            apply_list: apply_list.concat(applyTeacherList),
          });
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              has_more: false
            });
          }
        }
      },
      error: function (error) {
        wx.showToast({
          title: '网络错误',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
    });

    querySetApply.find({
      success: function (results) {
        wx.hideLoading()
        console.log(results);
        if (results.length == 0) {
          that.setData({
            judgeSetApply: false,
          });
        }
        else {
          var apply_set_list = that.data.apply_set_list;
          var teacherList = new Array();
          var applyTeacherList = new Array();
          for (var i = 0; i < results.length; i++) {
            teacherList[i] = results[i];
            applyTeacherList[i] = teacherList[i].get('applyTeacherDetail')
          }
          that.setData({
            apply_set_list: apply_set_list.concat(applyTeacherList),
          });
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              has_set_more: false
            });
          }
        }
      },
      error: function (error) {
        wx.showToast({
          title: '网络错误',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
    });
    console.log(that.data.apply_set_list)
  },

  showDetail: function (e) {
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.apply_list[index].id;
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    wx.navigateTo({
      url: '../teacherDetail/teacherDetail?showTelephone=true&showBottom=false&objectId=' + objectId
    });
    queryApply.equalTo("getApplyUser", currentUserId);
    queryApply.equalTo("applyTeacher", objectId);
    queryApply.find({
      success: function (result) {
        result[0].set("open", true);
        result[0].save();
      },
      error: function (error) {
        wx.showToast({
          title: '网络错误',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
    });
  },

  deleteApply: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.apply_list[index].id;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    queryApply.equalTo("getApplyUser", currentUserId);
    queryApply.equalTo("applyTeacher", objectId);
    queryApply.find({
      success: function (result) {
        result[0].set('delete', true);
        result[0].save();
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (error) {
      }
    });

  },

  onReachBottom: function () {
    if (!that.data.has_more) {
      return;
    }
    var page_index = that.data.page_index;
    that.setData({
      page_index: ++page_index
    });
    that.applyLoad();
  },

  onPullDownRefresh: function () {
    that.setData({
      page_index: 0,
      apply_list: [],
      has_more: true
    });
    that.applyLoad();

  },



})


