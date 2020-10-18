export default {
  name: 'Home',
  data(){
    return{
      users:[],
      roles: [],
      profile: [],
      user: []

    }
  },
  mounted(){
   this.getUsers()
   this.getRoles()
   this.getUser()
   this.getMe()
  },
  methods: {
    getUsers(){
      const vm = this
      this.$http.post('/Administration/GetListUsers', {
        "dateBegin": '',
        "dateEnd": '',
        "isDeleted": false,
        "email": '',
        "login": '',
        "fullName": '',
        "page": 1,
        "pageSize": 20
      }, {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }
      })
      .then(function(response) {
        vm.users = response.data.results;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    deleteUser(userName){
      const vm = this
      this.$http.post(`/Administration/DeleteProfile?userName=${userName}`, '', {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }
      })
      .then(function(response) {
        vm.getUsers()
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getRoles(){
      const vm = this
      this.$http.post(`/Administration/GetRoles`, '', {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }
      })
      .then(function(response) {
        vm.roles = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getUser(){
      const vm = this
      this.$http.post(`/Administration/GetUser?userName=Administrator`, '', {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }

      })
      .then(function(response) {
        vm.user = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getMe(){
      const vm = this
      this.$http.post(`/Registration/GetMyProfile`, '', {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }

      })
      .then(function(response) {
        vm.profile = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
  }
}