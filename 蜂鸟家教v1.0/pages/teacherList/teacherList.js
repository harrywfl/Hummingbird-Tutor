var Bmob = require('../../utils/bmob.js');
var app = getApp();
var utils = require('../../utils/util.js');
var that;


Page({
  data:{
    choseCourse:'全部课程',
    choseUniversity:'全部学校', 
    content: [],
    course: [],
    university: [],
    courseOpen:false,
    universityOpen:false,
    courseShow:false,
    universityShow:false,
    isfull:false,
    shownavindex:'',
    teacher_list: [],
    page_index: 0,
    loadingTip: '上拉加载更多',
    has_more: true,
    refreshTeacher:false,
    firstOpen:null,
  },
  onLoad: function(){
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
    var firstOpen = wx.getStorageSync('firstOpen')
    if (!firstOpen) {
      that.setData({
        firstOpen:true,
        isfull: true
      })
      wx.setStorageSync('firstOpen', true)
    }
    console.log(firstOpen)
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    that.filterTeacher();
    this.setData({
      course: ['全部课程','数学', '英语', '语文', '物理', '化学', '生物', '政治', '历史', '地理', '美术', '钢琴', '日语', '韩语'],
      university: ['全部学校','中国海洋大学', '中国石油大学', '青岛大学', '青岛理工大学', '青岛科技大学', '山东科技大学']
    })
  },

  courseList: function(e){
    if (this.data.courseOpen){
      this.setData({
        courseOpen:false,
        universityOpen:false,
        courseShow:false,
        universityShow:true,
        isfull:false,
        shownavindex: 0
      })
    }else{
      this.setData({
        content:this.data.course,
        courseOpen:true,
        universityOpen:false,
        courseShow:false,
        universityShow:true,
        isfull:true,
        shownavindex:e.currentTarget.dataset.nav
      })
    }
  },
  universityList: function(e){
    if (this.data.universityOpen){
      this.setData({
        courseOpen:false,
        universityOpen:false,
        courseShow: true,
        universityShow:false,
        isfull:false,
        shownavindex: 0
      })
    }else{
      this.setData({
        content: this.data.university,
        courseOpen:false,
        universityOpen:true,
        courseShow: true,
        universityShow:false,
        isfull:true,
        shownavindex:e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },

  selectCourse: function (e) {
    this.setData({
      courseOpen: false,
      universityOpen: false,
      courseShow: false,
      universityShow: true,
      isfull: false,
      choseCourse: e.currentTarget.dataset.course,
      page_index: 0,
      teacher_list: [],
      has_more: true
    });
    that.filterTeacher();
  },
  

  selectUniversity: function (e) {
    this.setData({
      courseOpen: false,
      universityOpen: false,
      courseShow: true,
      universityShow: false,
      isfull: false,
      choseUniversity: e.currentTarget.dataset.university,
      page_index: 0,
      teacher_list: [],
      has_more: true
    });
    that.filterTeacher();
  },


  hidebg: function(e){
    this.setData({
      courseOpen:false,
      universityOpen:false,
      courseShow:true,
      universityShow:true,
      isfull:false,
      shownavindex: 0
    })
  },


  openNow:function(){
    this.setData({
      isfull: false,
      firstOpen:false,
    })
    wx.setStorage({
      key: "firstOpen",
      data: "false"
    })
  },
 

  
  filterTeacher: function () {
    var Course = this.data.choseCourse;
    var University = this.data.choseUniversity;
    var page_size = 10;
    var teacher = Bmob.Object.extend("teacher");
    var query = new Bmob.Query(teacher);
    query.descending('updatedAt');
    query.skip(that.data.page_index * page_size);
    query.limit(page_size);
    wx.showLoading({
      title: '加载中...',
    })
    if (Course != '全部课程' && University!='全部学校'){
      query.equalTo("teach_course", Course);
      query.equalTo("university", University);
      query.find({
        success: function (results) {
          wx.hideLoading()
          // wx.stopPullDownRefresh();
          var teacher_list = that.data.teacher_list;
          that.setData({
            teacher_list: teacher_list.concat(results),
          });
          console.log(results)
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多老师哦',
              has_more: false
            });
          }
        },
        error: function (error) {
         
        }
      });
    }
    else if (Course != '全部课程' && University == '全部学校'){
      query.equalTo("teach_course", Course);
      query.find({
        success: function (results) {
          wx.hideToast();
          // wx.stopPullDownRefresh();
          var teacher_list = that.data.teacher_list;
          that.setData({
            teacher_list: teacher_list.concat(results),
          });
          console.log(results)
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多老师哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
    else if (Course == '全部课程' && University != '全部学校') {
      query.equalTo("university", University);
      query.find({
        success: function (results) {
          wx.hideToast();
          // wx.stopPullDownRefresh();
          var teacher_list = that.data.teacher_list;
          that.setData({
            teacher_list: teacher_list.concat(results),
          });
          console.log(results)
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多老师哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
  else if (Course == '全部课程' && University == '全部学校') {
      query.find({
        success: function (results) {
          wx.hideToast();
          // wx.stopPullDownRefresh();
  
          var teacher_list = that.data.teacher_list;

          that.setData({
            teacher_list: teacher_list.concat(results),
          });
          console.log(results)
          if (results.length < page_size) {
            that.setData({
              loadingTip: '过几天再刷刷，会有更多老师哦',
              has_more: false
            });
          }
        },
        error: function (error) {
          
        }
      });
    }
  },
  

  clickQD:function(){
    wx.showToast({
      title: '更多地区待开通中...',
      icon: 'none',
      duration: 3000
    })
  },

  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.teacher_list[index].id;
    wx.navigateTo({
      url: '../teacherDetail/teacherDetail?showTelephone=false&showBottom=true&objectId=' + objectId
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
    that.filterTeacher();
  },
  

  onPullDownRefresh: function () {
     that.setData({
       page_index: 0,
       teacher_list: [],
       has_more: true
     });
     that.filterTeacher();
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

