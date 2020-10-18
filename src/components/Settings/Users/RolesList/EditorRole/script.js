import notify from 'devextreme/ui/notify'
import { DxPopup } from 'devextreme-vue/popup';
import {
  DxForm,
  DxSimpleItem,
  DxLabel,
} from 'devextreme-vue/form';



export default {
  name: 'Home',
  components: {
    DxSimpleItem,
    DxLabel,
    DxForm,
    DxPopup,
    AcceptTbar:() =>import('@/components/Settings/Users/Toolbars/AcceptToolbar/AcceptToolbar.vue')
  },
  props: {
    isShow:{
      type: Boolean, 
      default: false
    },
    role: {
      type: Object,
      required: true,
      default: () => { }
    },
    roles: {
      required: true,
      default: () => { }
    },
    isCreate:{
      type: Boolean, 
      default: false
    }
  },
  data() {
    return {
      isError : false,
      errorMessage:'',
      groupCaption: function () {
        if(!this.isCreate){
          return "Редактирование роли" 
        }
        return "Создание роли" 
      }
    }
  },
  methods: {
    notifyError(){
      notify(this.errorMessage, 'error');
      this.errorMessage = ''
    },
    async saveBtnClick() {
      if(!this.isCreate){
        await this.editRole(this.role)
      } 
      else{
        await this.addRole(this.role)
      }
        if(this.isError){
          this.isError = false;
          this.notifyError();
          return;
        }
        this.$emit("create:role")
      this.closeBtnClick()
    },
    closeBtnClick() {
      this.$emit("close:editor",false)
    },
    async addRole(e) {
      const vm = this
      await this.$http.post('/Roles/AddRole',
        {
          "IdLevelorg": e.IdLevelorg,
          "CaptionRole": e.name
        },
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          if(response.data.errors.length>0){
            vm.isError = true  
            vm.errorMessage = response.data.errors[0].description;
            
          }  
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async editRole(role) {
      const vm = this
      await this.$http.post(`/Roles/Edit?idRole=${role.id}&newName=${role.name}`,
        '',
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          if(response.data.errors.length>0){
            vm.isError = true  
            vm.errorMessage = `Ошибка: ${response.data.errors[0].description}`;            
          }  
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  computed: {
    getTitle: function () {
      return this.groupCaption();
    }
  },
  mounted: function () {
  }
}