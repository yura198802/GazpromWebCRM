import router from "../router"

export default {
    name: 'Auth',
    data(){
        return {
            tokenReady: false
        }
    },
    mounted(){
        this.tokenReady()
    },
    methods: {
        checkToken(){
            this.tokenReady = this.$cookie.get('accessToken') && this.$cookie.get('accessToken') != null
        },
        checkPublic(){
            (this.token == true) ? this.router.push({path: '/dashboard'}) : '';
            this.refreshToken()
        },
        checkPrivate(){
            (this.token == false) ? this.router.push({path: '/login'}) : ''
        },
        refreshToken(){
            let cookie = this.$cookie
            this.$http.post('/Authorize/Login', cookie.get('refreshToken'), {
                headers: {

                }
            })
            .then(function (response) {
                console.log(response.data)
              cookie.set("accessToken", response.data.accessToken, { expires: `${response.data.expiresIn}s` })
              cookie.set("refreshToken", response.data.refreshToken, { expires: `${response.data.expiresIn}s` })
            })
            .catch(function (error) {
              console.log(error);
            });
        }
    }
}