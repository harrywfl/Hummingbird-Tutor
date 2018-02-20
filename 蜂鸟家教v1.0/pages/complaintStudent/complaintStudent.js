var Bmob = require('../../utils/bmob.js');
var that;

Page({


  data: {
    image_width: getApp().screenWidth / 4 - 10,
    loading: false,
    images: [],
    urlArr: [],
    reasonList: ["信息虚假", "中介冒充个人", "无故辞退教师", "对教师不尊重", "课时费问题", "其它问题"],
    id: null,
    choseReason: '',
    objectId:'',
    role:''

  },


  onLoad: function (options) {
    that = this;
    that.setData({
      objectId: options.objectId,
      role: options.role
    });
  },


  onShow: function () {

  },

  bindSubmit: function (e) {
    // 判断是否正在上传图片
    // if (that.data.loading) {
    // 	return;
    // }


    var reason = that.data.choseReason;
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    var getComplaint=that.data.objectId;
    var role=that.data.role;
    if (!reason) {
      wx.showToast({
        title: '请选择投诉原因',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (!content) {
      wx.showToast({
        title: '请填写具体说明',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else {
      var Complaint = Bmob.Object.extend("complaint");
      var complaint = new Complaint();
      complaint.set("getComplaint", getComplaint);
      complaint.set("getComplaintRole", role);
      complaint.set("content", content);
      complaint.set("reason", reason);
      complaint.set("images", that.data.urlArr);
      complaint.set("user", Bmob.User.current());
      //添加数据，第一个入口参数是null
      complaint.save(null, {
        success: function (result) {
          wx.showModal({
            title: '投诉成功',
            content: '已经收到您的投诉，待我们核实后会对其进行下架、整改等处理，谢谢您让蜂鸟家教变得更好。',
            showCancel: false,
            confirmText: '我知道啦',
            confirmColor: '#fe4c40',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        },
        error: function (result, error) {
          // 添加失败
          console.log('提交失败');

        }
      });
    }



  },


  choseReason: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值  
    this.setData({
      id: index,
      choseReason: that.data.reasonList[index]
    })
    console.log(that.data.id)
  },
  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var urlArr = that.data.urlArr;
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        var images = that.data.images;

        that.setData({
          images: images.concat(tempFilePaths)
        });
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();
          var j = 0;
          //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名      
            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();
              console.log("第" + i + "张Url" + url);
              urlArr.push({ url });
              j++;
              console.log(j, imgLength);
              that.setData({
                urlArr: urlArr,
                loading: true
              });
            },
              function (error) {
                console.log(error)
              });
          }
        }
      }
    })
    console.log(that.data.urlArr)
  },


  delete: function (e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    var urlArr = that.data.urlArr;
    urlArr.splice(index, 1);
    images.splice(index, 1);
    that.setData({
      images: images,
      urlArr: urlArr
    });
    console.log(that.data.urlArr)
  }

})