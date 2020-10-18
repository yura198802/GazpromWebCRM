export default {
  name: 'Home',
  data(){
    return{
      login: 'Administrator',
      password: 'Pass123$',
      remember: false,
      // login: '',
      // password: ''
    }
  },
  methods: {
    
    Auth(){
      let cookie = this.$cookie
      let router = this.$router
      this.$http.post('/Authorize/Login', {
        "login": this.login,
        "password": this.password
      })
      .then(function (response) {
        cookie.set("accessToken", response.data.accessToken, { expires: `${response.data.expiresIn}s` })
        cookie.set("refreshToken", response.data.refreshToken, { expires: `${response.data.expiresIn}s` })
        router.push({path: '/dashboard'})
        console.log(123, response);
      })
      .catch(function (error) {
      });
      
    }
  }
}