var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;


Page({
  data: {
    collect_list: [],
    has_more: true,
    page_index: 0,
    judgeCollect:true
  },

  onLoad: function () {
    that = this;
    that.collectLoad();
  },

  collectLoad: function () {
    var page_size = 10;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Collect = Bmob.Object.extend("collect");
    var queryCollect = new Bmob.Query(Collect);
    queryCollect.descending('createdAt');
    queryCollect.skip(that.data.page_index * page_size);
    queryCollect.limit(page_size);
    queryCollect.equalTo("currentUser", currentUserId);
    queryCollect.include("collectStudent")
    wx.showLoading({
      title: '加载中...',
    })
    queryCollect.find({
      success: function (results) {
        console.log(results)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (results.length == 0) {
          that.setData({
            judgeCollect: false,
          });
        }
        else {
          var collect_list = that.data.collect_list;
          var studentList = new Array();
          var CollectStudentList = new Array();
          for (var i = 0; i < results.length; i++) {
            studentList[i] = results[i];
            CollectStudentList[i] = studentList[i].get('collectStudent')
          }
          that.setData({
            collect_list: collect_list.concat(CollectStudentList),
          });
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
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.collect_list[index].id;
    wx.navigateTo({
      url: '../studentDetail/studentDetail?showTelephone=false&showBottom=true&objectId=' + objectId
    });
  },

  deleteCollect: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.collect_list[index].id;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var user = Bmob.Object.extend("_User");
    var query = new Bmob.Query(user);
    var collect = Bmob.Object.extend("collect");
    var queryCollect = new Bmob.Query(collect);
    query.get(currentUserId, {
      success: function (result) {
        result.remove("collect", objectId);
        result.save();
      },
      error: function (error) {
      }
    });
    queryCollect.find({
      success: function (result) {
        queryCollect.equalTo("collectStudent", objectId);
        queryCollect.equalTo("currentUser", currentUserId);
        queryCollect.destroyAll({
          success: function () {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
          },
          error: function (err) {
            // 删除失败
          }
        });
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
    that.collectLoad();
  },

  onPullDownRefresh: function () {
    that.setData({
      page_index: 0,
      collect_list: [],
      has_more: true
    });
    that.collectLoad();

  },



})