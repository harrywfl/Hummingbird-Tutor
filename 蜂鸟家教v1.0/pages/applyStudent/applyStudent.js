var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;


Page({
  data: {
    apply_list: [],
    has_more: true,
    page_index: 0,
    judgeApply: true
  },

  onLoad: function () {
    that = this;
    that.applyLoad();
  },

  applyLoad: function () {
    var page_size = 10;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    queryApply.descending('createdAt');
    queryApply.skip(that.data.page_index * page_size);
    queryApply.limit(page_size);
    queryApply.equalTo("getApplyUser", currentUserId);
    queryApply.equalTo("delete", false);
    queryApply.include("applyStudent")
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
          var studentList = new Array();
          var applyStudentList = new Array();
          for (var i = 0; i < results.length; i++) {
            studentList[i] = results[i];
            applyStudentList[i] = studentList[i].get('applyStudent')
          }
          that.setData({
            apply_list: apply_list.concat(applyStudentList),
          });
          console.log(results)
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
  },

  showDetail: function (e) {
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.apply_list[index].id;
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    wx.navigateTo({
      url: '../studentDetail/studentDetail?showTelephone=true&showBottom=false&objectId=' + objectId
    });
    queryApply.equalTo("getApplyUser", currentUserId);
    queryApply.equalTo("applyStudent", objectId);
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
    queryApply.equalTo("applyStudent", objectId);
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