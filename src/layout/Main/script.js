import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";
export default {
  name: 'Main',
  data() {
    return{
      layout: '',
      ready: false,
      tokenReady: false
    }
  },
  components:{
     Public: ()=> import('@/layout/Public/Public'),
     Private: ()=> import('@/layout/Private/Private'),
  },
  methods:{
    checkToken(){
      if(this.$cookie.get('accessToken') && this.$cookie.get('accessToken') != null) {
        //(this.layout != 'Private') ? this.$router.push({path: '/Dashboard'}) : false
        this.refreshToken()
      } else {
        (this.layout != 'Public') ? this.$router.push({path: '/login'}) : false
      }
    },

    refreshToken(){

        let cookie = this.$cookie
        this.$http.post(`/Authorize/RefreshToken?token=${cookie.get('refreshToken')}`, '')
        .then(function (response) {
          cookie.set("accessToken", response.data.accessToken, { expires: `${response.data.expiresIn}s` })
          cookie.set("refreshToken", response.data.refreshToken, { expires: `${response.data.expiresIn}s` })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  mounted() {
    this.layout = this.$route.meta.layout
    this.checkToken()
    // alert(this.tokenReady)
    // alert(this.$route.meta.layout)
    // (this.layout == 'Private') ? this.checkPrivate() : this.checkPublic()
  },

  created() {
    loadMessages(ruMessages);
    locale('ru');
  },
  watch: {
    $route: function(to) {
      this.layout = to.meta.layout
      this.checkToken()
    },
  }
}
