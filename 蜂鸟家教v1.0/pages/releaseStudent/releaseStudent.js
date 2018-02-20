var Bmob = require('../../utils/bmob.js');
var that;

Page({
  data: {
    student: {},
    photoUrl: '',
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
        var Student = Bmob.Object.extend("student");
        var query = new Bmob.Query(Student);
        query.get(releaseId, {
          success: function (results) {
            that.setData({
              student: results
            })
            console.log(that.data.student)
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
  },

  preview: function (e) {
    wx.previewImage({
      current: this.data.photoUrl, // 当前显示图片的http链接
      urls: [this.data.photoUrl] // 需要预览的图片http链接列表
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
          var Student = Bmob.Object.extend("student");
          var query = new Bmob.Query(Student);
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
                success: function (resultStudent) {
                  query.equalTo("objectId", releaseId);
                  query.destroyAll({
                    success: function () {
                      resultUser.set('release', '');
                      resultUser.set('register', false);
                      resultUser.save();

                      queryCollect.find({
                        success: function (resultCollect) {
                          queryCollect.equalTo("collectStudent", releaseId);
                          queryCollect.destroyAll({
                            success: function () {
                              queryApply.find({
                                success: function (resultApply) {
                                  queryApply.equalTo("applyStudent", releaseId);
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
  modifyRelease: function () {
    wx.redirectTo({
      url: '../modifyStudent/modifyStudent'
    })
  },

  getMap: function () {
    wx.openLocation({
      latitude: that.data.student.attributes.latitude,
      longitude: that.data.student.attributes.longitude,
      name: that.data.student.attributes.addressName,
      address: that.data.student.attributes.addressDetail,
      scale: 28,
    })
  }


})


