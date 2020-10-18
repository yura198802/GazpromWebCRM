export default {
  name: 'Home',
  data(){
    return{
      
      login: 'Administrator',
      password: 'Pass123$',
      repass: '',
      lname: '',
      fname: '',
      pname: '',
      email: '',
      phone: '',
    }
  },
  methods: {
    
    register(){
      let cookie = this.$cookie
      this.$http.post('/Registration/RegistrationUserAndSetPassword', {
          "email": this.email,
          "account": this.login,
          "surname": this.lname,
          "name": this.fname,
          "middlename": this.pname,
          "phone": this.phone,
          "password": this.password,
          "confirmPassword": this.repass
      })
      .then(function (response) {
       console.log(response.data)
      })
      .catch(function (error) {
        console.log(error.response);
      });
    }
  }
}