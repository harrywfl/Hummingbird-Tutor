// useHelp.js
Page({


  data: {
    showHowGetTeacher:false,
    showHowGetStudent: false,
    showProtectPrivacy: false,
    showAboutSalary: false,
    showSecurity: false
    
  },

 
  onLoad: function (options) {
  
  },

  onShow: function () {
  
  },

  showHowGetTeacher:function(){
    if (this.data.showHowGetTeacher==false)
    {
      this.setData({
        showHowGetTeacher: true,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
    else{
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
  },

  showHowGetStudent: function () {
    if (this.data.showHowGetStudent == false) {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: true,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
    else {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
  },

  showProtectPrivacy: function () {
    if (this.data.showProtectPrivacy == false) {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: true,
        showAboutSalary: false,
        showSecurity: false
      });
    }
    else {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
  },


  showAboutSalary: function () {
    if (this.data.showAboutSalary == false) {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: true,
        showSecurity: false
      });
    }
    else {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
  },

  showSecurity: function () {
    if (this.data.showSecurity == false) {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: true
      });
    }
    else {
      this.setData({
        showHowGetTeacher: false,
        showHowGetStudent: false,
        showProtectPrivacy: false,
        showAboutSalary: false,
        showSecurity: false
      });
    }
  },

  feedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback'
    });
  }


  



 
})