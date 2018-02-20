var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var that;


Page({
  data: {
    inputText: '',

    sexArray: ['男老师', '女老师'],
    sexIndex: 0,
    sex:'请选择您的性别',

    universityArray: ['中国海洋大学', '中国石油大学', '青岛大学', '青岛理工大学', '青岛科技大学', '山东科技大学'],
    universityIndex: 0,
    university:'请选择您的学校',

    trait:'',

    degreeArray: ['本科', '研究生'],
    degreeIndex: 0,
    degree:'请选择您的学历',

    courseList: 
     [ { name: "数学", chose: "false" }, { name: "英语", chose: "false"  }, { name: "语文",  chose: "false"  }, { name: "物理",  chose: "false" },{ name: "化学",  chose: "false" }, { name: "生物", chose: "false" }, { name: "历史", chose: "false" }, { name: "地理",  chose: "false"  },{ name: "美术",  chose: "false"  }, { name: "钢琴",  chose: "false" }, { name: "日语",  chose: "false" }, { name: "韩语",  chose: "false"  }],
          // ["数学", "英语", "语文", "物理", "化学", "生物", "历史", "地理", "美术", "钢琴", "日语", "韩语"],
    // id: null,
    choseCourse: [],
    
    traitList:
    [{ name: "教学经验丰富", chose: "false" }, { name: "有成功案例", chose: "false" }, { name: "提分快", chose: "false" }, { name: "注重基础", chose: "false" }, { name: "严厉", chose: "false" }, { name: "有耐心", chose: "false" }, { name: "和学生交朋友", chose: "false" }, { name: "心理辅导", chose: "false" }, { name: "幽默风趣", chose: "false" }, { name: "沟通能力强", chose: "false" }, { name: "备课详细", chose: "false" }, { name: "引导学生自主学习", chose: "false" }, { name: "善于鼓励", chose: "false" }],
    choseTrait: [],

    photo:"../../image/photo111.png",
    loading: true,


    image_width: getApp().screenWidth / 4 - 10,
    loading: false,
    images: [],
    urlArr: [],

    inputName: null,
    inputTelephone: null,
    inputSex: null,
    inputUniversity: null,
    inputDegree: null,
    inputMajor: null,
    inputScore: null,
    inputSalary: null,


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
                          console.log( url);
                          showPic(url, that)
                  }, 
                  function (error) {
                    console.log(error)
                  });
      }
    })
  },


  onLoad:function(){
    that=this;
    wx.showModal({
      title: '您的电话不会公开显示',
      content: '为保护您的隐私，仅当您主动向家长发送申请时，对方才可看到您的电话',
      showCancel: false,
      confirmText: '我知道啦',
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
    var abc = new Array();
    abc=that.data.courseList;
    // for(var i=0;i<abc.length;i++){
      // console.log(abc[i])
    // }
    console.log(abc[1].name)
  },

  teacherInput: function (e) {
    var Firts = e.detail.value.substring(0, 1);
    var inputText = Firts + "老师"
    this.setData({
      inputText: inputText
    })
    console.log(this.data.inputText)
    if (!e.detail.value || e.detail.value == '老师' || e.detail.value == '老老师') {
      this.setData({
        inputName: false
      })
    }
    else {
      this.setData({
        inputName: true
      })
    }
  },



  inputTelephoneRight: function (e) {
    if (!e.detail.value) {
      this.setData({
        inputTelephone: false
      })
    }
    else {
      this.setData({
        inputTelephone: true
      })
    }
  },

  inputMajorRight: function (e) {
    if (!e.detail.value) {
      this.setData({
        inputMajor: false
      })
    }
    else {
      this.setData({
        inputMajor: true
      })
    }
  },

  inputScoreRight: function (e) {
    if (!e.detail.value) {
      this.setData({
        inputScore: false
      })
    }
    else {
      this.setData({
        inputScore: true
      })
    }
  },

  inputSalaryRight: function (e) {
    if (!e.detail.value) {
      this.setData({
        inputSalary: false
      })
    }
    else {
      this.setData({
        inputSalary: true
      })
    }
  },




  sexChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value,
      sex: that.data.sexArray[e.detail.value]
    })
    if (!that.data.sexArray[e.detail.value]) {
      this.setData({
        inputSex: false
      })
    }
    else {
      this.setData({
        inputSex: true
      })
    }
  },

  universityChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      universityIndex: e.detail.value,
      university: that.data.universityArray[e.detail.value]
    })
    if (!that.data.universityArray[e.detail.value]) {
      this.setData({
        inputUniversity: false
      })
    }
    else {
      this.setData({
        inputUniversity: true
      })
    }
  },

  degreeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      degreeIndex: e.detail.value,
      degree: that.data.degreeArray[e.detail.value]
    })
    if (!that.data.degreeArray[e.detail.value]) {
      this.setData({
        inputDegree: false
      })
    }
    else {
      this.setData({
        inputDegree: true
      })
    }
  },


  choseCourse: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值 
    var choseCourse = that.data.choseCourse;
    var courseListNow=that.data.courseList;
    if (that.data.courseList[index].chose=='false'){
      if (that.data.choseCourse.length >= 3) {
        wx.showToast({
          title: '最多只可选择三项教学科目',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
      else{
        choseCourse.push(that.data.courseList[index].name);
        courseListNow[index].chose = "true";
        this.setData({
          // id: index,
          courseList: courseListNow,
          choseCourse: choseCourse
        })
        console.log(that.data.courseList)
        console.log(that.data.choseCourse)
      }
    }
    else if (that.data.courseList[index].chose=='true'){
      courseListNow[index].chose = "false";
      for (var i = 0; i <choseCourse.length;i++){
        if (choseCourse[i] == courseListNow[index].name){
          choseCourse.splice(i,1);
          break;
        }
      }
      this.setData({
        // id: index,
        courseList: courseListNow,
        choseCourse: choseCourse
      })
      console.log(that.data.courseList)
      console.log(that.data.choseCourse)
    }
  },

  choseTrait: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值 
    var choseTrait = that.data.choseTrait;
    var traitListNow = that.data.traitList;
    if (that.data.traitList[index].chose == 'false') {
      if (that.data.choseTrait.length >= 5) {
        wx.showToast({
          title: '最多只可选择五项教学特点',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
      else {
        choseTrait.push(that.data.traitList[index].name);
        traitListNow[index].chose = "true";
        this.setData({
          // id: index,
          traitList: traitListNow,
          choseTrait: choseTrait
        })
        console.log(that.data.traitList)
        console.log(that.data.choseTrait)
      }
    }
    else if (that.data.traitList[index].chose == 'true') {
      traitListNow[index].chose = "false";
      for (var i = 0; i < choseTrait.length; i++) {
        if (choseTrait[i] == traitListNow[index].name) {
          choseTrait.splice(i, 1);
          break;
        }
      }
      this.setData({
        // id: index,
        traitList: traitListNow,
        choseTrait: choseTrait
      })
      console.log(that.data.traitList)
      console.log(that.data.choseTrait)
    }
  },



  registerSuccess: function (e) {
    var nowTime = utils.getTime();
    var teacherName = e.detail.value.teacherName;
    var telephone = e.detail.value.telephone;
    var photo = this.data.photo;
    var choseCourse=this.data.choseCourse;
    var choseTrait = this.data.choseTrait;
    var major = e.detail.value.major;
    var teacherScore = e.detail.value.teacherScore;
    var salary = e.detail.value.salary;
    var remark = e.detail.value.remark;
    var sex = this.data.sexArray[this.data.sexIndex];
    var university = this.data.universityArray[this.data.universityIndex];
    var degree = this.data.degreeArray[this.data.degreeIndex];
    if (university=='中国海洋大学'){
      this.setData({
        trait: '985'
      })
    } else if (university == '中国石油大学'){
      this.setData({
        trait: '211'
      })
    } else if (university == '中国海洋大学' && university == '中国石油大学' || degree=='研究生') {
      this.setData({
        trait: '研究生'
      })
    } else if (university != '中国海洋大学' || university != '中国石油大学' || degree != '研究生') {
      this.setData({
        trait: 'null'
      })
    }
    
    if (!teacherName || teacherName == '老师' || teacherName=='老老师') {
      wx.showToast({
        title: '请填写您的称呼',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputName: false
      })
    }
    else if (!telephone) {
      wx.showToast({
        title: '请填写您的电话',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputTelephone: false
      })
    }
    else if (photo =="../../image/photo111.png") {
      wx.showToast({
        title: '请添加您的头像',
        image: '../../image/warn.png',
        duration: 2000
       })
    }
    else if (!major) {
      wx.showToast({
        title: '请填写您的专业',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputMajor: false
      })
    }
    else if (!teacherScore) {
      wx.showToast({
        title: '请填写您的高考分数',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputScore: false
      })
    }
    else if (!salary) {
      wx.showToast({
        title: '请填写您的期望薪资',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputSalary: false
      })
    }
    else if (choseCourse.length == 0) {
      wx.showToast({
        title: '请选择教学科目',
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
    else{
      var user = Bmob.Object.extend("_User");
      var UserModel = new user();

      var Teacher = Bmob.Object.extend("teacher");
      var teacher = new Teacher();
      var query = new Bmob.Query(user);
      var objectId, that = this;
      var currentUser = Bmob.User.current();
      objectId = currentUser.id;
     

      teacher.set("teacher_name", teacherName);
      teacher.set("telephone", telephone);
      teacher.set("major", major);
      teacher.set("teacher_score", teacherScore);
      teacher.set("salary", salary);
      teacher.set("self_int", remark);
      teacher.set("sex", sex);
      teacher.set("university", university);
      teacher.set("degree", degree);
      teacher.set("teach_course", choseCourse);
      teacher.set("teach_trait", choseTrait);
      teacher.set("photo", photo);
      teacher.set("trait", this.data.trait);
      teacher.set("own", objectId);
      teacher.set("images", that.data.urlArr);
      teacher.set("modifyTime", nowTime);
 

      teacher.save(null, {
        success: function (result) {
          var releaseId = result.id;
          console.log("日记创建成功, objectId:" + result.id);
          query.get(objectId, {
            success: function (result) {
              result.set('release', releaseId);
              result.set('register', true);
              result.set('role', "teacher");
              result.save();

              wx.showToast({
                title: '发布成功',
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
            error: function (object, error) {
              wx.showToast({
                title: '网络错误',
                image: '../../image/warn.png',
                duration: 2000
              })
            }
          });
        },
        error: function (result, error) {
          wx.showToast({
            title: '网络错误',
            image: '../../image/warn.png',
            duration: 2000
          })
        }
      });
    }
  },

  jumpStudent: function () {
    wx.redirectTo({
      url: '../student-register/student-register'
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
  previewImage: function (e) {
    var current = e.currentTarget.dataset.current;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.images // 需要预览的图片http链接列表
    })
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