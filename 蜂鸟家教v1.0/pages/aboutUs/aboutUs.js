// useHelp.js
var that;
Page({


  data: {
    screenWidth: getApp().screenWidth,
    lean:''


  },


  onLoad: function (options) {
    that=this;
    that.lean();
  },

  onShow: function () {

  },

  lean:function(){
    wx.startAccelerometer()
    wx.onAccelerometerChange(function (res) {
      console.log(res.x)
      var lean =-15* res.x;
      that.setData({
        lean: lean,
      });
    })
  }


})