var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var app = getApp();
var that;


Page({
  data: {
    student: {},
    objectId: '',
    judgeCollect: false,
    showTelephone: 'false',
    showBottom: 'true',
    own:'',
    telephone: '',
     collectNumber: '',
    applyNumber: '',
     isfull: false,
    goldUser: null,
    addressName: '',
    addressDetail: '',
    latitude: '',
    longitude: '',
    traitList: [],
    teacherTrait:[]

  },

  onLoad: function (options) {
    that = this;
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    that.setData({
      showTelephone: options.showTelephone,
      showBottom: options.showBottom,
    });
    console.log(that.data.showTelephone)
    var objectId = options.objectId;
    var student = Bmob.Object.extend("student");
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new User();
    var queryUser = new Bmob.Query(User);
    var query = new Bmob.Query(student);
    query.get(objectId, {
      success: function (result) {
        console.log(result)
        var own = result.get("own");
        var telephone = result.get("telephone");
        var latitude = result.get("latitude");
        var longitude = result.get("longitude");
        var addressName = result.get("addressName");
        var addressDetail = result.get("addressDetail");
        var traitList = result.get("studentTrait");
        var teacherTrait = result.get("teacherTrait");

        that.setData({
          own: own,
          student: result,
          objectId: objectId,
          telephone: telephone,
          latitude: latitude ,
          longitude: longitude,
          addressName: addressName,
          addressDetail: addressDetail,
          traitList: traitList,
          teacherTrait: teacherTrait

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
    queryUser.get(currentUserId, {
      success: function (result) {
        var collectArr = result.get("collect");
        console.log(collectArr);
        for (var i = 0; i <= collectArr.length; i++) {
          if (collectArr[i] == objectId) {
            that.setData({
              judgeCollect: true
            })
          }
        }
      },
      error: function (object, error) {
        wx.showToast({
          title: '网络错误',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
    });

    var collect = Bmob.Object.extend("collect");
    var queryCollect = new Bmob.Query(collect);
    queryCollect.equalTo("collectStudent", objectId);
    queryCollect.count({
      success: function (countCollect) {
        console.log("共有 " + countCollect + " 条记录");
        that.setData({
          collectNumber: countCollect + "次收藏"
        })
      },
      error: function (error) {
      }
    });
    var apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(apply);
    queryApply.equalTo("applyStudentDetail", objectId);
    queryApply.count({
      success: function (countApply) {
        console.log("共有 " + countApply + " 条记录");
        that.setData({
          applyNumber: countApply + "次申请"
        })
      },
      error: function (error) {
        // 查询失败
      }
    });


  },

  complaint: function () {
    var objectId= that.data.objectId;
    wx.navigateTo({
      url: '../complaintStudent/complaintStudent?role=student&objectId='+objectId
    })
  },

  collect: function () {
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var user = new User();
    var query = new Bmob.Query(User);
    query.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        if (register == false) {
          wx.showModal({
            title: '您尚未注册',
            content: '注册后可更快速找到合适的家教',
            confirmText: '立即注册',
            confirmColor: '#fe4c40',
            cancelColor: '#bdbdbd',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../teacher-register/teacher-register'
                })
              }
              else if (res.cancel) {
                result;
              }
            }
          })
        }
        else if (register == true) {
          var role = result.get("role");
          console.log(role);
          if (role == "student") {
            wx.showToast({
              title: '您是家长/学生，仅可收藏教师',
              image: '../../image/warn.png',
              duration: 2000
            })
          }
          else if (role == "teacher") {
            var collectArr = result.get("collect");
            console.log(collectArr);
            var hadCollect;
            for (var i = 0; i <= collectArr.length; i++) {
              if (collectArr[i] == that.data.objectId) {
                hadCollect = true;
              }
            }
            if (hadCollect == true) {
              wx.showToast({
                title: "已结收藏过啦",
                icon: "success",
                duration: 1000
              })
            } else {
              result.add("collect", that.data.objectId);
              result.save();
              var currentUser = Bmob.User.current();
              var Student = Bmob.Object.extend("student");
              var studentModel = new Student();
              var Collect = Bmob.Object.extend("collect");
              var collect = new Collect();
              studentModel.id = that.data.objectId;
              collect.set("currentUser", currentUserId);
              collect.set("collectStudent", studentModel);
              collect.save(null, {
                success: function (result) {
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  console.log("日记创建成功, objectId:" + result.id);
                },
                error: function (result, error) {
                  // 添加失败
                  console.log('创建日记失败');

                }
              });

              that.setData({
                judgeCollect: true
              });
              wx.showToast({
                title: "收藏成功",
                icon: "success",
                duration: 1000
              })
            }
          }
        }
      },
    });
  },

  talk: function () {
    var nowTime = utils.getTime();
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;

    var Apply = Bmob.Object.extend("apply");
    var queryApply = new Bmob.Query(Apply);
    queryApply.equalTo("applyUser", currentUserId);
    queryApply.equalTo("applyTime", nowTime);

    var user = Bmob.Object.extend("_User");
    var query = new Bmob.Query(user);
    query.get(currentUserId, {
      success: function (result) {
        var applyNumberLimit = result.get("applyNumberLimit");
        var releaseId = result.get("release");
        var register = result.get("register");
        if (register == false) {
          wx.showModal({
            title: '您尚未注册',
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
                result;
              }
            }
          })
        }
        else if (register == true) {
          var role = result.get("role");
          if (role == "student") {
            wx.showToast({
              title: '您是家长，仅可向教师发送申请',
              image: '../../image/warn.png',
              duration: 2000
            })
          }
          else if (role == "teacher") {
            var excludeApply = new Bmob.Query(Apply);
            excludeApply.equalTo("applyTeacher", releaseId);
            excludeApply.equalTo("applyStudentDetail", that.data.objectId);
            excludeApply.find({
              success: function (results) {
                if (results.length!=0){
                  wx.showToast({
                    title: '您已经给对方发送过啦！',
                    image: '../../image/warn.png',
                    duration: 2000
                  })
                }
                else{
                    queryApply.find({
                      success: function (resultTime) {
                        if (resultTime.length < applyNumberLimit) {
                          var surplus = applyNumberLimit - resultTime.length;
                          console.log('您还可发送' + surplus + '次')
                          console.log('已经发送' + resultTime.length)
                          wx.showModal({
                            confirmColor: '#fe4c40',
                            cancelText: '再多看看',
                            confirmText: '立即发送',
                            title: '您今日还可发送' + surplus + '次申请',
                            content: '对方将收到您的信息，如果有意向对方会通过您预留的手机号与您联系',
                            success: function (res) {
                              if (res.confirm) {
                                var Teacher = Bmob.Object.extend("teacher");
                                var teacherModel = new Teacher();
                                teacherModel.id = releaseId;
                                var Student = Bmob.Object.extend("student");
                                var studentModel = new Student();
                                studentModel.id = that.data.objectId;
                                var Apply = Bmob.Object.extend("apply");
                                var apply = new Apply();
                                apply.set("applyTime", nowTime);
                                apply.set("applyUser", currentUserId);
                                apply.set("getApplyUser", that.data.own);
                                apply.set("applyTeacher", teacherModel);
                                apply.set("applyStudentDetail", studentModel);
                                apply.set("open", false);
                                apply.set("delete", false);
                                apply.set("deleteSet", false);
                                apply.save(null, {
                                  success: function (result) {
                                    that.firstApply();

                                  },
                                  error: function (result, error) {
                                    console.log('创建日记失败');
                                  }
                                });
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })
                        }
                        else if (resultTime.length >= 3) {
                          console.log('您今天的发送次数已经用完，明天再来吧')
                          wx.showToast({
                            title: '您今天的发送次数已经用完，明天再来吧',
                            image: '../../image/warn.png',
                            duration: 2000
                          })
                        }
                      },
                      error: function (error) {
                        console.log("查询失败: " + error.code + " " + error.message);
                      }
                    });     
                }
              },
              error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
              }
            });
          }
        }
      },
    });
  },

  firstApply: function () {
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var Apply = Bmob.Object.extend("apply");
    var firstApplyQuery = new Bmob.Query(Apply);
    firstApplyQuery.equalTo("applyUser", currentUserId);
    firstApplyQuery.count({
      success: function (count) {
        console.log(count)
        if (count == 1) {
          that.setData({
            goldUser: true,
            isfull: true
          })
        }
        else {
          wx.showToast({
            title: '发送成功！',
            icon: 'success',
            duration: 2000
          })
        }
      },
      error: function (error) {
      }
    });
  },


  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: that.data.telephone
    })
  },



  collectClick: function () {

  },

  onShareAppMessage: function (res) {
    var objectId = that.data.objectId;
    if (res.from === 'button') {
      console.log(res)
    }
    if (res.target.dataset.id == "111") {
      return {
        title: '给你推荐个很棒的家教',
        path: '/pages/teacherDetail/teacherDetail?objectId=' + objectId,
        success: function (res) {
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 3000
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    else if (res.target.dataset.id == "222") {
      return {
        title: '找家教 就来蜂鸟家教',
        path: '/pages/teacherList/teacherList',
        imageUrl: '../../image/shareImage.png',

        success: function (res) {
          var currentUser = Bmob.User.current();
          var user = Bmob.Object.extend("_User");
          var queryUser = new Bmob.Query(user);
          queryUser.get(currentUser.id, {
            success: function (result) {
              result.set("applyNumberLimit", "6");
              result.save();
              wx.showToast({
                title: '申请次数提升为6次！',
                icon: 'success',
                duration: 3000
              })
              that.setData({
                isfull: false,
                goldUser: false
              })
            },
            error: function (object, error) {
              // 查询失败
              console.log("升级失败")
            }
          });
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },

  giveUp: function () {
    wx.showModal({
      title: '放弃后每日只可申请三次',
      content: '申请的次数直接决定能否找到更合适的家教',
      confirmText: '继续使用',
      cancelText: '确定放弃',
      confirmColor: '#fe4c40',
      cancelColor: '#bdbdbd',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
          })
        } else if (res.cancel) {
          that.setData({
            isfull: false,
            goldUser: false
          })
        }
      }
    })
  },

  getMap:function(){
    wx.openLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      name: that.data.addressName,
      address: that.data.addressDetail,
      scale: 28,
    })
  }

})