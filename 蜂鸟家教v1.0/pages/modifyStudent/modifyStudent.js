var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var that;


Page({
  data: {

    student: {},

    courseArray: ['数学', '英语', '语文', '物理', '化学', '生物', '政治', '历史', '地理', '美术', '钢琴', '日语', '韩语'],
    courseEnglish: ['math', 'english', 'chinese', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography', 'art', 'piano', 'Japanese', 'korean'],
    courseIndex: 0,

    basicArray: ['较差', '中下', '中等', '中上', '较好'],
    basicIndex: 0,

    levelArray: [['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], ['一年级', '二年级', '三年级'], ['一年级', '二年级', '三年级']],
    gradeArray: [['小学', '初中', '高中'], ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']],
    gradeIndex: [0, 0],
    gradeArr: [],

    traitArray: ['有能力即可', '211高校', '985高校', '研究生'],
    traitIndex: 0,

    sexArray: ['无要求', '男老师', '女老师'],
    sexIndex: 0,


    frequencyArray: ['一周一次', '一周两次', '一周三次', '一周四次', '一周五次', '一周六次', '一周七次'],
    frequencyIndex: 0,

    addressName: '',
    addressDetail: '',
    latitude: '',
    longitude: '',

  },


  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var student = Bmob.Object.extend("student");
    var query = new Bmob.Query(student);
    query.equalTo("own", currentUserId);
    query.find({
      success: function (result) {
        for (var i = 0; i < that.data.courseArray.length; i++) {
          if (result[0].get("course") == that.data.courseArray[i]) {
            var courseIndex = i;
          }
        }
        var gradeIndex = result[0].get("gradeIndex");
        for (var i = 0; i < 3; i++) {
          if (gradeIndex[0] == i) {
            that.setData({
              gradeArray: [['小学', '初中', '高中'], that.data.levelArray[i]],
            })
          }
        }
        for (var i = 0; i < that.data.basicArray.length; i++) {
          if (result[0].get("basic") == that.data.basicArray[i]) {
            var basicIndex = i;
          }
        }
        for (var i = 0; i < that.data.traitArray.length; i++) {
          if (result[0].get("trait_limit") == that.data.traitArray[i]) {
            var traitIndex = i;
          }
        }
        for (var i = 0; i < that.data.sexArray.length; i++) {
          if (result[0].get("sex") == that.data.sexArray[i]) {
            var sexIndex = i;
          }
        }
  
        for (var i = 0; i < that.data.frequencyArray.length; i++) {
          if (result[0].get("frequency") == that.data.frequencyArray[i]) {
            var frequencyIndex = i;
          }
        }
        that.setData({
          student: result[0],
          courseIndex: courseIndex,
          gradeIndex: gradeIndex,
          basicIndex: basicIndex,
          traitIndex: traitIndex,
          sexIndex: sexIndex,
          frequencyIndex: frequencyIndex,
          addressName: result[0].attributes.addressName,
          addressDetail: result[0].attributes.addressDetail,
          latitude: result[0].attributes.latitude,
          longitude: result[0].attributes.longitude,
        })
        console.log(that.data.student)
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




  courseChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseIndex: e.detail.value
    })
  },


  gradeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var A = this.data.gradeArray[0][this.data.gradeIndex[0]];
    var B = this.data.gradeArray[1][this.data.gradeIndex[1]];
    this.setData({
      gradeIndex: e.detail.value,
      gradeArr: [A, B]
    })
    console.log(this.data.gradeArr);
  },


  gradeColumnChange: function (e) {
    console.log(this.data.levelArray[0]);
    console.log(this.data.levelArray[1])
    console.log(this.data.levelArray[2])
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      gradeArray: this.data.gradeArray,
      gradeIndex: this.data.gradeIndex
    };
    data.gradeIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.gradeIndex[0]) {
          case 0:
            data.gradeArray[1] = this.data.levelArray[0];
            break;
          case 1:
            data.gradeArray[1] = this.data.levelArray[1];
            break;
          case 2:
            data.gradeArray[1] = this.data.levelArray[2];
            break;
        }
        data.gradeIndex[1] = 0;
        break;
    }
    this.setData(data);
  },



  basciChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      basicIndex: e.detail.value
    })
  },

  traitChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      traitIndex: e.detail.value
    })
  },

  sexChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },



  frequencyChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      frequencyIndex: e.detail.value
    })
  },


  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },


  registerSuccess: function (e) {
    var nowTime = utils.getTime();
    var course = this.data.courseArray[this.data.courseIndex];
    var courseEnglish;

    for (var i = 0; i < this.data.courseEnglish.length; i++) {
      if (course == this.data.courseArray[i]) {
        courseEnglish = this.data.courseEnglish[i]
      }
    }

    if (this.data.gradeArr.length == 0) {
      var grade = ["小学", "一年级"]
    } else {
      var grade = this.data.gradeArr;
    }
    var gradeIndex = this.data.gradeIndex;
    var basic = this.data.basicArray[this.data.basicIndex];
    var trait = this.data.traitArray[this.data.traitIndex];
    var sex = this.data.sexArray[this.data.sexIndex];
    var frequency = this.data.frequencyArray[this.data.frequencyIndex];
    var salary = e.detail.value.salary;
    var telephone = e.detail.value.telephone;
    var remark = e.detail.value.remark;
    var addressName = this.data.addressName;
    var addressDetail = this.data.addressDetail;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;


    if (!salary) {
      wx.showToast({
        title: '请填写课时费（最终可与教师商议）',
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
    else if (!remark) {
      wx.showToast({
        title: '请尽量详细填写你的备注',
        image: '../../image/warn.png',
        duration: 2000
      })
    }
    else {
      var Student = Bmob.Object.extend("student");
      var queryStudent = new Bmob.Query(Student);
      var currentUser = Bmob.User.current();
      var currentUserId = currentUser.id;
      var user = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(user);
      queryUser.get(currentUserId, {
        success: function (result) {
          var releaseId = result.get("release");

          queryStudent.get(releaseId, {
            success: function (results) {
              results.set("course", course);
              results.set("gradeIndex", gradeIndex);
              results.set("grade", grade);
              results.set("basic", basic);
              results.set("trait_limit", trait);
              results.set("frequency", frequency);
              results.set("salary", salary);
              results.set("telephone", telephone);
              results.set("remark", remark);
              results.set("courseEnglish", courseEnglish);
              results.set("remark", remark);
              results.set("modifyTime", nowTime);
              results.set("addressName", addressName);
              results.set("addressDetail", addressDetail);
              results.set("latitude", latitude);
              results.set("longitude", longitude);
              results.save();


              wx.showToast({
                title: '修改成功',
                icon: 'success',
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../releaseStudent/releaseStudent'
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

  getAddress: function () {
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          addressName: res.name,
          addressDetail: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          inputAddress: true
        })
      },
      fail: function () {



        wx.getSetting({
          success: (res) => {
            console.log(res);
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '警告',
                content: '若不授权您的地理信息，将无法正常使用蜂鸟家教，因为教师需要权衡到达上课地点的距离，这是优秀教师是否愿意上课的重要主观因素。\n仅获取您的大致地址，绝不会泄露您的隐私',
                confirmText: '授权',
                confirmColor: '#2ba945',
                cancelColor: '#bdbdbd',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        res.authSetting = {
                          "scope.userLocation": true
                        }
                      }
                    })

                  } else if (res.cancel) {
                  }
                }
              })

            }
          }

        })



      }
    })
  }
})