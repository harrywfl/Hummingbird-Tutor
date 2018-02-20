var Bmob = require('../../utils/bmob.js');
var that;

Page({
  data: {
    choseCourse: '全部课程',
    choseGrade: '全部年级',
    content: [],
    course: [],
    grade: [],
    studentCourse:'数学',
    courseOpen: false,
    gradeOpen: false,
    courseShow: false,
    gradeShow: false,
    isfull: false,
    shownavindex: '',
    student_list: [],
    page_index: 0,
    loadingTip: '上拉加载更多',
    has_more: true,
    refreshStudent: false,
  },
  onLoad: function () {
    that = this;
    wx.setClipboardData({
      data: '8OCw5j661P',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    that.filterStudent();
    this.setData({
      course: ['全部课程','数学', '英语', '语文', '物理', '化学', '生物', '政治', '历史', '地理', '美术', '钢琴', '日语', '韩语'],
      grade: ['全部年级','小学', '初中', '高中']
    })
  },

  courseList: function (e) {
    if (this.data.courseOpen) {
      this.setData({
        courseOpen: false,
        gradeOpen: false,
        courseShow: false,
        gradeShow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.course,
        courseOpen: true,
        gradeOpen: false,
        courseShow: false,
        gradeShow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  gradeList: function (e) {
    if (this.data.gradeOpen) {
      this.setData({
        courseOpen: false,
        gradeOpen: false,
        courseShow: true,
        gradeShow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.grade,
        courseOpen: false,
        gradeOpen: true,
        courseShow: true,
        gradeShow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },

  //课程列表选择
  selectCourse: function (e) {
    this.setData({
      courseOpen: false,
      gradeOpen: false,
      courseShow: false,
      gradeShow: true,
      isfull: false,
      choseCourse: e.currentTarget.dataset.course,
      page_index: 0,
      student_list: [],
      has_more: true
    });
    that.filterStudent();
    

  },

  //年级列表选择
  selectgrade: function (e) {
    this.setData({
      courseOpen: false,
      gradeOpen: false,
      courseShow: true,
      gradeShow: false,
      isfull: false,
      choseGrade: e.currentTarget.dataset.grade,
      page_index: 0,
      student_list: [],
      has_more: true
    });
    that.filterStudent();
  },


  hidebg: function (e) {
    this.setData({
      courseOpen: false,
      gradeOpen: false,
      courseShow: true,
      gradeShow: true,
      isfull: false,
      shownavindex: 0
    })
  },

  


  filterStudent: function () {
    
    var Course = this.data.choseCourse;
    var Grade = this.data.choseGrade;
    var page_size = 10;
    var student = Bmob.Object.extend("student");
    var query = new Bmob.Query(student);
    query.descending('updatedAt');
    query.skip(that.data.page_index * page_size);
    query.limit(page_size);
    wx.showLoading({
      title: '加载中...',
    })
    if (Course != '全部课程' && Grade != '全部年级') {
      query.equalTo("course", Course);
      query.equalTo("grade", Grade);
      query.find({
        success: function (results) {
          wx.hideLoading()

          var student_list = that.data.student_list;

          that.setData({
            student_list: student_list.concat(results),
          });
          console.log(results)
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多信息哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
    else if (Course != '全部课程' && Grade == '全部年级') {
      query.equalTo("course", Course);
      query.find({
        success: function (results) {
          wx.hideToast();

          var student_list = that.data.student_list;

          that.setData({
            student_list: student_list.concat(results),
          });
          console.log(results)
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多信息哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
    else if (Course == '全部课程' && Grade != '全部年级') {
      query.equalTo("grade", Grade);
      query.find({
        success: function (results) {
          wx.hideToast();
 
          var student_list = that.data.student_list;

          that.setData({
            student_list: student_list.concat(results),
          });
          console.log(results)
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多信息哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
    else if (Course == '全部课程' && Grade == '全部年级') {
      query.find({
        success: function (results) {
          wx.hideToast();

          var student_list = that.data.student_list;

          that.setData({
            student_list: student_list.concat(results),
          });
          console.log(results)
          // 判断无更多数据
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多信息哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
  },



  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.student_list[index].id;
    wx.navigateTo({
      url: '../studentDetail/studentDetail?showTelephone=false&showBottom=true&objectId=' + objectId
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
    that.filterStudent();
  },

  clickQD: function () {
    wx.showToast({
      title: '更多地区待开通中...',
      icon: 'none',
      duration: 3000
    })
  },


  onPullDownRefresh: function () {
    that.setData({
      page_index: 0,
      student_list: [],
      has_more: true
    });
    that.filterStudent();

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
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


})

