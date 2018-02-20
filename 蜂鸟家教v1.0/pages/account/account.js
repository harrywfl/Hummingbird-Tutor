var Bmob = require('../../utils/bmob.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    newApply:'',
  },

  onShow:function(){
    var objectId, that = this;
    var currentUser = Bmob.User.current();
    objectId = currentUser.id;
    var user = Bmob.Object.extend("_User");
    var query = new Bmob.Query(user);
    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    queryApply.equalTo("getApplyUser", objectId);
    queryApply.equalTo("open", false);
    queryApply.count({
      success: function (count) {
        that.setData({
          newApply: count
        })
      },
      error: function (error) {
      }
    });
  },

  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  collect:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new User();
    var query = new Bmob.Query(User);
    query.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        var role = result.get("role");
        if (register == false) {
          wx.showModal({
            title: '尚未注册',
            content: '注册后可更快速找到合适的家教',
            confirmText: '立即注册',
            confirmColor: '#fe4c40',
            cancelColor: '#bdbdbd',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../teacher-register/teacher-register'
                })
              } else if (res.cancel) {
              }
            }
          })
        }
        else if (register == true) {
          if (role == "teacher") {
            wx.navigateTo({
              url: '../collectStudent/collectStudent'
            })
          }
          else if (role == "student") {
            wx.navigateTo({
              url: '../collectTeacher/collectTeacher'
            })
          }
        }
      },
      error: function (error) {
      }
    });
  },



  apply: function () {
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new User();
    var query = new Bmob.Query(User);
    query.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        var role = result.get("role");
        if (register == false) {
          wx.showModal({
            title: '尚未注册',
            content: '注册后可更快速找到合适的家教',
            confirmText: '立即注册',
            confirmColor: '#fe4c40',
            cancelColor: '#bdbdbd',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../teacher-register/teacher-register'
                })
              } else if (res.cancel) {
              }
            }
          })
        }
        else if (register==true){
          if (role == "teacher") {
            wx.navigateTo({
              url: '../applyStudent/applyStudent'
            })
          }
          else if (role == "student") {
            wx.navigateTo({
              url: '../applyTeacher/applyTeacher'
            })
          }
        }
      },
      error: function (error) {
      }
    });
  },

  release:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new User();
    var query = new Bmob.Query(User);
    query.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        var role = result.get("role");
        if (register == false) {
          wx.showModal({
            title: '尚未注册',
            content: '注册后可更快速找到合适的家教',
            confirmText: '立即注册',
            confirmColor: '#fe4c40',
            cancelColor: '#bdbdbd',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../teacher-register/teacher-register'
                })
              } else if (res.cancel) {
              }
            }
          })
        }
        else if (register == true) {
          if (role == "teacher") {
            wx.navigateTo({
              url: '../releaseTeacher/releaseTeacher'
            })
          }
          else if (role == "student") {
            wx.navigateTo({
              url: '../releaseStudent/releaseStudent'
            })
          }
        }
      },
      error: function (error) {
      }
    });
  },

  useHelp:function(){
    wx.navigateTo({
      url: '../useHelp/useHelp'
    })
  },

  aboutUs:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUs'
    })
  }


})


