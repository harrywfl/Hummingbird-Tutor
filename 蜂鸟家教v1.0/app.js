var Bmob = require('utils/bmob.js');
Bmob.initialize("", "");


App({
  onLaunch: function () {
    var that = this;
    that.login();
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  login: function () {
    var user = new Bmob.User;
    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {
      console.log('login');
      wx.login({
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) {
            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u);
            var openid = user.get("authData").weapp.openid;
            wx.setStorageSync('openid', openid)
            if (user.get("nickName")) {
              query.get(user.id, {
                success: function (result) {
                  var release = result.get("release");
                  if (release.length==0){
                    result.set("register", false);
                    result.save();
                  }
                  else{
                    result.set("register", true);
                    result.save();
                  }
                },
                error: function (result, error) {
                  wx.showToast({
                    title: '网络错误',
                    image: '../../image/warn.png',
                    duration: 2000
                  })
                }
              });
            } else {
              query.get(user.id, {
                success: function (result) {
                  wx.setStorageSync('own', result.get("uid"));
                  result.set("register", false);
                  result.set("collect", []);
                  result.save();

                },
                error: function (result, error) {
                  wx.showToast({
                    title: '网络错误',
                    image: '../../image/warn.png',
                    duration: 2000
                  })
                }
              });


              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  query.get(user.id, {
                    success: function (result) {
                      result.set('userPic', avatarUrl);
                      result.set('nickName', nickName);   
                      result.set('applyNumberLimit', "3");   
                      result.save();
                    }
                  });
                }
              });
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
    }
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
  }
})


