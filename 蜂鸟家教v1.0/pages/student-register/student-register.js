var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var that;


Page({
  data: {
    courseArray: ['数学', '英语', '语文', '物理', '化学', '生物', '政治', '历史', '地理', '美术', '钢琴', '日语', '韩语'],
    courseEnglish: ['math', 'english', 'chinese', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography', 'art', 'piano', 'Japanese', 'korean'],
    courseIndex: 0,
    course:'请选择您要补习的课程',

    basicArray: ['较差', '中下', '中等', '中上', '较好'],
    basicIndex: 0,
    basic:'请选择孩子的学习基础',


    gradeArray: [['小学', '初中', '高中'], ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']],
    gradeIndex: [0, 0],
    gradeArr:[],
    gradeFirst:'请选择您孩子的年级',
    gradeSecond:'',

    traitArray: ['有能力即可', '211高校', '985高校', '研究生'],
    traitIndex: 0,
    teacherTrait:'请选择教师资质',

    sexArray: ['无要求', '男老师', '女老师'],
    sexIndex: 0,
    sex:'请选择教师性别',

    frequencyArray: ['一周一次', '一周两次', '一周三次',  '一周四次', '一周五次', '一周六次', '一周七次'],
    frequencyIndex: 0,
    frequency:'请选择补习次数',

    studentTraitList:
    [{ name: "学习主动性差", chose: "false" }, { name: "学习速度慢", chose: "false" }, { name: "抵触心理大", chose: "false" }, { name: "叛逆", chose: "false" }, { name: "内向", chose: "false" }, { name: "没有耐心", chose: "false" }, { name: "自卑", chose: "false" }, { name: "粗心大意", chose: "false" }, { name: "偏科", chose: "false" }, { name: "公式、单词记不住", chose: "false" }, { name: "贪玩", chose: "false" }, { name: "沉迷手机、电脑", chose: "false" }, { name: "注意力不集中", chose: "false" }],
    choseStudentTrait: [],



    teacherTraitList:
    [{ name: "教学经验丰富", chose: "false" }, { name: "有成功案例", chose: "false" }, { name: "提分快", chose: "false" }, { name: "注重基础", chose: "false" }, { name: "严厉", chose: "false" }, { name: "有耐心", chose: "false" }, { name: "和学生交朋友", chose: "false" }, { name: "心理辅导", chose: "false" }, { name: "幽默风趣", chose: "false" }, { name: "沟通能力强", chose: "false" }, { name: "备课详细", chose: "false" }, { name: "引导学生自主学习", chose: "false" }, { name: "善于鼓励", chose: "false" }],
    choseTeacherTrait: [],

    
    addressName:'',
    addressDetail:'',
    latitude:'',
    longitude:'',

    inputName:null,
    inputTelephone:null,
    inputCourse:null,
    inputGrade: null,
    inputBasic: null,
    inputTrait: null,
    inputSex: null,
    inputFrequency: null,
    inputSalary: null,
    inputAddress: null




  },

  onLoad: function () {
    that = this;
    wx.showModal({
      title: '您的电话不会公开显示',
      content: '为保护您的隐私，仅当您主动向教师发送申请时，对方才可看到您的电话',
      showCancel: false,
      confirmText: '我知道啦',
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
  },

  inputNameRight:function(e){
    if (!e.detail.value){
      this.setData({
        inputName: false
      })
    }
    else{
      this.setData({
        inputName: true
      })
    }
  },

  inputTelephoneRight:function (e) {
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

  courseChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseIndex: e.detail.value,
      course: that.data.courseArray[e.detail.value]
    })
    if (!that.data.courseArray[e.detail.value]) {
      this.setData({
        inputCourse: false
      })
    }
    else {
      this.setData({
        inputCourse: true
      })
    }
  },


  gradeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var A = this.data.gradeArray[0][this.data.gradeIndex[0]];
    var B = this.data.gradeArray[1][this.data.gradeIndex[1]];
    this.setData({
      gradeIndex: e.detail.value,
      gradeArr:[A,B],
      gradeFirst:A,
      gradeSecond:B
    })
    console.log(this.data.gradeArr);
    if (!A||!B) {
      this.setData({
        inputGrade: false
      })
    }
    else {
      this.setData({
        inputGrade: true
      })
    }
  },


  gradeColumnChange: function (e) {
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
            data.gradeArray[1] = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
            break;
          case 1:
            data.gradeArray[1] = ['一年级', '二年级', '三年级'];
            break;
          case 2:
            data.gradeArray[1] = ['一年级', '二年级', '三年级'];
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
      basicIndex: e.detail.value,
      basic: that.data.basicArray[e.detail.value]
    })
    if (!e.detail.value) {
      this.setData({
        inputBasic: false
      })
    }
    else {
      this.setData({
        inputBasic: true
      })
    }
  },

  traitChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      traitIndex: e.detail.value,
      teacherTrait: that.data.traitArray[e.detail.value]
    })
    if (!e.detail.value) {
      this.setData({
        inputTrait: false
      })
    }
    else {
      this.setData({
        inputTrait: true
      })
    }
  },

  sexChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value,
      sex: that.data.sexArray[e.detail.value]
    })
    if (!e.detail.value) {
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




  frequencyChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      frequencyIndex: e.detail.value,
      frequency: that.data.frequencyArray[e.detail.value]
    })
    if (!e.detail.value) {
      this.setData({
        inputFrequency: false
      })
    }
    else {
      this.setData({
        inputFrequency: true
      })
    }
  },


  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },

  choseStudentTrait: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值 
    var choseStudentTrait = that.data.choseStudentTrait;
    var studentTraitListNow = that.data.studentTraitList;
    if (that.data.studentTraitList[index].chose == 'false') {
      if (that.data.choseStudentTrait.length >= 5) {
        wx.showToast({
          title: '最多只可选择五项',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
      else {
        choseStudentTrait.push(that.data.studentTraitList[index].name);
        studentTraitListNow[index].chose = "true";
        this.setData({
          // id: index,
          studentTraitList: studentTraitListNow,
          choseStudentTrait: choseStudentTrait
        })
        console.log(that.data.studentTraitList)
        console.log(that.data.choseStudentTrait)
      }
    }
    else if (that.data.studentTraitList[index].chose == 'true') {
      studentTraitListNow[index].chose = "false";
      for (var i = 0; i < choseStudentTrait.length; i++) {
        if (choseStudentTrait[i] == studentTraitListNow[index].name) {
          choseStudentTrait.splice(i, 1);
          break;
        }
      }
      this.setData({
        // id: index,
        studentTraitList: studentTraitListNow,
        choseStudentTrait: choseStudentTrait
      })
      console.log(that.data.traitList)
      console.log(that.data.choseStudentTrait)
    }
  },


  choseTeacherTrait: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值 
    var choseTeacherTrait = that.data.choseTeacherTrait;
    var teacherTraitListNow = that.data.teacherTraitList;
    if (that.data.teacherTraitList[index].chose == 'false') {
      if (that.data.choseTeacherTrait.length >= 5) {
        wx.showToast({
          title: '最多只可选择五项',
          image: '../../image/warn.png',
          duration: 2000
        })
      }
      else {
        choseTeacherTrait.push(that.data.teacherTraitList[index].name);
        teacherTraitListNow[index].chose = "true";
        this.setData({
          // id: index,
          teacherTraitList: teacherTraitListNow,
          choseTeacherTrait: choseTeacherTrait
        })
        console.log(that.data.teacherTraitList)
        console.log(that.data.choseTeacherTrait)
      }
    }
    else if (that.data.teacherTraitList[index].chose == 'true') {
      teacherTraitListNow[index].chose = "false";
      for (var i = 0; i < choseTeacherTrait.length; i++) {
        if (choseTeacherTrait[i] == teacherTraitListNow[index].name) {
          choseTeacherTrait.splice(i, 1);
          break;
        }
      }
      this.setData({
        // id: index,
        teacherTraitList: teacherTraitListNow,
        choseTeacherTrait: choseTeacherTrait
      })
      console.log(that.data.traitList)
      console.log(that.data.choseTeacherTrait)
    }
  },


  registerSuccess: function (e) {
    var nowTime = utils.getTime();
    var addressIndex = this.data.addressIndex;
    var gradeIndex = this.data.gradeIndex;
    var name = e.detail.value.name;
    var telephone = e.detail.value.telephone;
    var choseTeacherTrait = this.data.choseTeacherTrait;
    var choseStudentTrait = this.data.choseStudentTrait;
    var course = this.data.courseArray[this.data.courseIndex];
    var courseEnglish;

    for (var i =0; i < this.data.courseEnglish.length;i++){
      if (course == this.data.courseArray[i]){
        courseEnglish = this.data.courseEnglish[i]
      }
    }
    console.log(courseEnglish)

    if (this.data.gradeArr.length == 0){
      var grade = ["小学", "一年级"]
    }else{
      var grade = this.data.gradeArr;
    }
    var basic = this.data.basicArray[this.data.basicIndex];
    var trait = this.data.traitArray[this.data.traitIndex];
    var sex = this.data.sexArray[this.data.sexIndex];

    var addressName=this.data.addressName;
    var addressDetail = this.data.addressDetail;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    console.log(latitude);
    console.log(longitude);
    var frequency = this.data.frequencyArray[this.data.frequencyIndex];
    var salary = e.detail.value.salary;
    var remark = e.detail.value.remark;
    if (!name) {
      wx.showToast({
        title: '请填写您的称呼',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputName:false
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
    else if (this.data.course=="请选择您要补习的课程") {
      wx.showToast({
        title: '请选择您要补习的课程',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputCourse: false
      })
    }
    else if (!this.data.gradeSecond) {
      wx.showToast({
        title: '请选择您孩子的年级',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputGrade: false
      })
    }
    else if (this.data.basic == "请选择孩子的学习基础") {
      wx.showToast({
        title: '请选择孩子的学习基础',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputBasic: false
      })
    }
    else if (this.data.teacherTrait == "请选择教师资质") {
      wx.showToast({
        title: '请选择教师资质',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputTrait: false
      })
    }
    else if (this.data.sex == "请选择教师性别") {
      wx.showToast({
        title: '请选择教师性别',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputSex: false
      })
    }
    else if (this.data.frequency == "请选择补习次数") {
      wx.showToast({
        title: '请选择补习次数',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputFrequency: false
      })
    }
    else if (!salary) {
      wx.showToast({
        title: '请填写课时费（最终可与教师商议）',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputSalary: false
      })
    }
    else if (!this.data.addressName || !this.data.addressDetail) {
      wx.showToast({
        title: '请选择您的上课地点',
        image: '../../image/warn.png',
        duration: 2000
      })
      this.setData({
        inputAddress: false
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
      var user = Bmob.Object.extend("_User");
      var UserModel = new user();

      var Student = Bmob.Object.extend("student");
      var student = new Student();
      var query = new Bmob.Query(user);
      var objectId, that = this;
      var currentUser = Bmob.User.current();
      objectId = currentUser.id;


      student.set("name", name);
      student.set("telephone", telephone);
      student.set("course", course);
      student.set("gradeIndex", gradeIndex);
      student.set("grade", grade);
      student.set("basic", basic);
      student.set("trait_limit", trait);
      student.set("sex", sex);
      student.set("frequency", frequency);
      student.set("salary", salary);
      student.set("addressName", addressName);
      student.set("studentTrait", choseStudentTrait);
      student.set("teacherTrait", choseTeacherTrait);
      student.set("addressDetail", addressDetail);
      student.set("latitude", latitude);
      student.set("longitude", longitude);
      student.set("remark", remark);
      student.set("courseEnglish", courseEnglish);
      student.set("own", objectId);
      student.set("modifyTime", nowTime);



      student.save(null, {
        success: function (result) {
          var releaseId = result.id;
          query.get(objectId, {
            success: function (result) {
              result.set('release', releaseId);
              result.set('register', true);
              result.set('role', "student");
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
              console.log("111")
              wx.showToast({
                
                title: '网络错误',
                image: '../../image/warn.png',
                duration: 2000
              })
            }
          });
        },
        error: function (result, error) {
          console.log("222")

          wx.showToast({
            title: '网络错误',
            image: '../../image/warn.png',
            duration: 2000
          })
        }
      });
    }
  },
  jumpTeacher:function(){
    wx.redirectTo({
      url: '../teacher-register/teacher-register'
    })
  },

  getAddress:function(){
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          addressName: res.name,
          addressDetail: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          inputAddress:true
        })
      },
      fail:function(){



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