var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var that;


Page({
  data: {

    teacher: {},

    universityArray: ['中国海洋大学', '中国石油大学', '青岛大学', '青岛理工大学', '青岛科技大学', '山东科技大学'],
    universityIndex: 0,

    trait: '',

    degreeArray: ['本科', '研究生'],
    degreeIndex: 0,

    course: [
      [{ name: '数学', value: '数学' }, { name: '英语', value: '英语' }, { name: '语文', value: '语文' }, { name: '物理', value: '物理' }],
      [{ name: '化学', value: '化学' }, { name: '生物', value: '生物' }, { name: '历史', value: '历史' }, { name: '地理', value: '地理' },],
      [{ name: '美术', value: '美术' }, { name: '钢琴', value: '钢琴' }, { name: '日语', value: '日语' }, { name: '韩语', value: '韩语' },]
    ],

    courseArr: [],

    photo: "",
    loading: true,


    image_width: getApp().screenWidth / 4 - 10,
    loading: false,
    images: [],
    urlArr: []
  },


  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Teacher = Bmob.Object.extend("teacher");
    var query = new Bmob.Query(Teacher);
    query.equalTo("own", currentUserId);
    query.find({
      success: function (result) {
        for (var i = 0; i < that.data.universityArray.length; i++) {
          if (result[0].get("university") == that.data.universityArray[i]) {
            var universityIndex = i;
          }
        }
        if (result[0].get("degree") == '本科') {
          var degreeIndex = 0
        } else if (result[0].get("degree") == '研究生') {
          var degreeIndex = 1
        }
        that.setData({
          teacher: result[0],
          photo: result[0].get("photo"),
          urlArr: result[0].get("images"),
          universityIndex: universityIndex,
          degreeIndex: degreeIndex
        })
        console.log(that.data.teacher)
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


  universityChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      universityIndex: e.detail.value
    })
  },

  degreeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      degreeIndex: e.detail.value
    })
  },


  courseboxChange: function (e) {
    var courseArr = e.detail.value;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (courseArr.length > 3) {
      wx.showToast({
        title: '最多只可选择三项教学科目',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    this.setData({
      courseArr: courseArr
    })
  },

  registerSuccess: function (e) {
    var nowTime = utils.getTime();
    var photo = this.data.photo;
    var telephone = e.detail.value.telephone;
    var major = e.detail.value.major;
    var salary = e.detail.value.salary;
    var remark = e.detail.value.remark;
    var university = this.data.universityArray[this.data.universityIndex];
    var degree = this.data.degreeArray[this.data.degreeIndex];
    var course = this.data.courseArr;
    if (university == '中国海洋大学') {
      this.setData({
        trait: '985'
      })
    } else if (university == '中国石油大学') {
      this.setData({
        trait: '211'
      })
    } else if (university == '中国海洋大学' && university == '中国石油大学' || degree == '研究生') {
      this.setData({
        trait: '研究生'
      })
    } else if (university != '中国海洋大学' || university != '中国石油大学' || degree != '研究生') {
      this.setData({
        trait: 'null'
      })
    }
    if (!major) {
      wx.showToast({
        title: '请填写您的专业',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (!telephone) {
      wx.showToast({
        title: '请填写您的电话',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (!salary) {
      wx.showToast({
        title: '请填写您的期望薪资',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (course.length > 3) {
      wx.showToast({
        title: '最多只可选择三项教学科目',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (course.length == 0) {
      wx.showToast({
        title: '请选择您可教学的科目',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else if (!remark) {
      wx.showToast({
        title: '请尽量详细填写你的备注',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else {
      var Teacher = Bmob.Object.extend("teacher");
      var queryTeacher = new Bmob.Query(Teacher);
      var currentUser = Bmob.User.current();
      var currentUserId = currentUser.id;
      var user = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(user);
      queryUser.get(currentUserId, {
        success: function (result) {
          var releaseId = result.get("release");
          queryTeacher.get(releaseId, {
            success: function (results) {
              results.set("major", major);
              results.set("salary", salary);
              results.set("telephone", telephone);
              results.set("self_int", remark);
              results.set("university", university);
              results.set("degree", degree);
              results.set("teach_course", course);
              results.set("photo", photo);
              results.set("images", that.data.urlArr);
              results.set("trait", that.data.trait);
              results.set("modifyTime", nowTime);
              results.save();

              wx.showToast({
                title: '修改成功',
                icon: 'success',
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../releaseTeacher/releaseTeacher'
                    })
                  }, 2000);
                }
              });
            },
            error: function (object, error) {
              wx.showToast({
                title: '网络错误',
                image: '../../image/warn.png',
                duration: 2000
              })
            }
          });
        },
        error: function (object, error) {
          wx.showToast({
            title: '网络错误',
            image: '../../image/warn.png',
            duration: 2000
          })
        }
      });
    }
  },


  uploadPhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var Photo = that.data.photo;
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var newDate = new Date();
        var newDateStr = newDate.toLocaleDateString();
        var extension = /\.([^.]*)$/.exec(tempFilePaths);
        if (extension) {
          extension = extension[1].toLowerCase();
        }
        var name = newDateStr + "." + extension;//上传的图片的别名      
        var file = new Bmob.File(name, tempFilePaths);
        file.save().then(function (res) {
          wx.hideNavigationBarLoading()
          var url = res.url();
          console.log(url);
          showPic(url, that)
        },
          function (error) {
          });
      }
    })
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
              // if (imgLength == j) {
              //   console.log(imgLength, urlArr);
              //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
              // showPic(urlArr, that)
              that.setData({
                urlArr: urlArr,
                loading: true
              });
              // }
            }, function (error) {
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

function showPic(url, t) {
  t.setData({
    loading: true,
    photo: url
  })
}