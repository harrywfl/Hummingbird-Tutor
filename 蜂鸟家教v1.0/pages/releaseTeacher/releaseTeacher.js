var Bmob = require('../../utils/bmob.js');
var that;

Page({
  data: {
    image_width: getApp().screenWidth / 4 - 10,
    teacher: {},
    photoUrl: '',
    imageArr: [],
    collectNumber: '',
    applyNumber: '',
    releaseId:''
  },

  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var user = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(user);
    queryUser.get(currentUserId, {
      success: function (result) {
        // 查询成功，调用get方法获取对应属性的值
        var releaseId = result.get("release");
        var Teacher = Bmob.Object.extend("teacher");
        var query = new Bmob.Query(Teacher);
        query.get(releaseId, {
          success: function (results) {
            var imageList = results.get("images");
            var photoUrl = results.get("photo");
            var imageArr = new Array();
            for (var i = 0; i < imageList.length; i++) {
              imageArr[i] = imageList[i].url
            }
            that.setData({
              teacher: results,
              imageArr: imageArr,
              releaseId: releaseId,
              photoUrl: photoUrl,

            })
            console.log(that.data.teacher)
          },
          error: function (object, error) {
            // 查询失败
          }
        });
      },
      error: function (object, error) {
        // 查询失败
      }
    });

    var collect = Bmob.Object.extend("collect");
    var queryCollect = new Bmob.Query(collect);
    queryCollect.equalTo("collectTeacher", that.data.releaseId);
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
    queryApply.equalTo("applyTeacherDetail", that.data.releaseId);
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

  preview: function (e) {
    wx.previewImage({
      current: this.data.photoUrl, // 当前显示图片的http链接
      urls: [that.data.photoUrl] // 需要预览的图片http链接列表
    })
  },

  previewImage: function (e) {
    var current = e.currentTarget.dataset.current;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imageArr // 需要预览的图片http链接列表
    })
  },

  deleteRelease: function () {
    wx.showModal({
      title: '确认删除？',
      content: '删除后将不能寻找家教',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '清除数据中...',
          })
          var currentUser = Bmob.User.current();
          var currentUserId = currentUser.id;
          var Teacher = Bmob.Object.extend("teacher");
          var query = new Bmob.Query(Teacher);
          var user = Bmob.Object.extend("_User");
          var queryUser = new Bmob.Query(user);
          var collect = Bmob.Object.extend("collect");
          var queryCollect = new Bmob.Query(collect);
          var apply = Bmob.Object.extend("apply");
          var queryApply = new Bmob.Query(apply);
          queryUser.get(currentUserId, {
            success: function (resultUser) {
              var releaseId = resultUser.get("release");
              query.find({
                success: function (resultTeacher) {
                  query.equalTo("objectId", releaseId);
                  query.destroyAll({
                    success: function () {
                      resultUser.set('release', '');
                      resultUser.set('register', false);
                      resultUser.save();
                      queryCollect.find({
                        success: function (resultCollect) {
                          queryCollect.equalTo("collectTeacher", releaseId);
                          queryCollect.destroyAll({
                            success: function () {
                              
                              queryApply.find({
                                success: function (resultApply) {
                                  queryApply.equalTo("applyTeacher", releaseId);
                                  queryApply.destroyAll({
                                    success: function () {
                                      wx.hideLoading()
                                      wx.showToast({
                                        title: '已删除',
                                        icon: 'success',
                                        success: function () {
                                          setTimeout(function () {

                                            if (wx.reLaunch) {
                                              wx.reLaunch({
                                                url: '/pages/teacherList/teacherList'
                                              });
                                            } else {
                                              wx.switchTab({
                                                url: '/pages/teacherList/teacherList'
                                              })
                                            }

                                          }, 2000);
                                        }
                                      });
                                    },
                                    error: function (err) {
                                      // 删除失败
                                    }
                                  });
                                }
                              });
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
                    error: function (object, error) {
                      
                    }
                  })
                },
                error: function (object, error) {
                  
                }
              })
            },
            error: function (object, error) {
              
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  modifyRelease:function(){
    wx.redirectTo({
      url: '../modifyTeacher/modifyTeacher'
    })
  }


})


