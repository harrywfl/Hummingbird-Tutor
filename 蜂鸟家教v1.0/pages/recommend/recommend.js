var Bmob = require('../../utils/bmob.js');
var that;

Page({


  data: {
    matching:false,
    teacherResult:false,
    studentResult: false,
    getTeacherResult:{},
    getStudentResult:{},
    role:'',
    objectId:'',
    
  },

 
  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    queryUser.get(currentUserId, {
      success: function (result) {
        var role = result.get("role");
        that.setData({
          role: role
        })
      },
      error: function (object, error) {
      }
    });

  },

  onShow: function () {
  
  },

  matching:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);

    var teacher = Bmob.Object.extend("teacher");
    var student = Bmob.Object.extend("student");
    var queryTeacher = new Bmob.Query(teacher);
    
    var queryStudent = new Bmob.Query(student);
    var role=that.data.role;

    queryUser.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        if (register == false) {
          wx.showModal({
            title: '尚未注册',
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
              }
            }
          })
        }
        else if (register == true) {
          if (role == "teacher") {
            

            that.setData({
              matching: true
            })
            setTimeout(
              function () {
                if (role == 'teacher') {
                  queryStudent.find({
                    success: function (results) {
                      console.log("共查询到 " + results.length + " 条记录");
                      function randomNum(Min, Max) {
                        var Range = Max - Min;
                        var Rand = Math.random();
                        var num = Min + Math.round(Rand * Range);
                        that.setData({
                          getStudentResult: results[num],
                          objectId: results[num].id
                        })

                      }
                      randomNum(0, results.length);
                      console.log(that.data.getStudentResult)


                    },
                    error: function (error) {
                      console.log("查询失败: " + error.code + " " + error.message);
                    }
                  });
                }
                that.setData({
                  studentResult: true
                })
              }, 3000
            );


           
          }
          else if (role == "student") {
            that.setData({
              matching: true
            })
            setTimeout(
              function () {
                if (role == 'student') {
                  queryTeacher.find({
                    success: function (results) {
                      console.log("共查询到 " + results.length + " 条记录");
                      function randomNum(Min, Max) {
                        var Range = Max - Min;
                        var Rand = Math.random();
                        var num = Min + Math.round(Rand * Range);
                        that.setData({
                          getTeacherResult: results[num],
                          objectId: results[num].id
                        })

                      }
                      randomNum(0, results.length);
                      console.log(that.data.getTeacherResult)

                    },
                    error: function (error) {
                      console.log("查询失败: " + error.code + " " + error.message);
                    }
                  });
                }
                that.setData({
                  teacherResult: true
                })
              }, 3000
            );

            
          }
        }
      },
      error: function (error) {
      }
    });

    
    
  },

  changeResult:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);

    var teacher = Bmob.Object.extend("teacher");
    var student = Bmob.Object.extend("student");
    var queryTeacher = new Bmob.Query(teacher);
    var queryStudent = new Bmob.Query(student);
    var role = that.data.role;
    if(role=="teacher"){

      that.setData({
        matching: true,
        studentResult: false,
      })
      setTimeout(
        function () {
          queryStudent.find({
              success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                function randomNum(Min, Max) {
                  var Range = Max - Min;
                  var Rand = Math.random();
                  var num = Min + Math.round(Rand * Range);
                  that.setData({
                    getStudentResult: results[num],
                    objectId: results[num].id
                  })
                  console.log(num)
                }
                randomNum(0, results.length);
                console.log(that.data.getStudentResult)

              },
              error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
              }
            });
          that.setData({
            studentResult: true
          })
        }, 3000

      );

    }
    else if (role=="student"){
      that.setData({
        matching: true,
        teacherResult: false,
      })
      setTimeout(
        function () {
          if (role == 'student') {
            queryTeacher.find({
              success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                function randomNum(Min, Max) {
                  var Range = Max - Min;
                  var Rand = Math.random();
                  var num = Min + Math.round(Rand * Range);
                  that.setData({
                    getTeacherResult: results[num],
                    objectId: results[num].id
                  })
                  console.log(num)
                }
                randomNum(0, results.length);
                console.log(that.data.getTeacherResult)

              },
              error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
              }
            });
          }
          that.setData({
            teacherResult: true
          })
        }, 3000

      );
    }
  },

  showDetail:function(){
    var objectId = that.data.objectId;
    console.log(objectId)
    if(that.data.role=="teacher"){
      wx.navigateTo({
        url: '../studentDetail/studentDetail?objectId=' + objectId
      });
    }
    else if(that.data.role=="student"){
      wx.navigateTo({
        url: '../teacherDetail/teacherDetail?objectId=' + objectId
      });
    }
  }

 
})