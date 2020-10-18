import DxButton from 'devextreme-vue/button';
import {
  DxValidator,
  DxRequiredRule
} from 'devextreme-vue/validator';
import DxToolbar from 'devextreme-vue/toolbar';
import notify from 'devextreme/ui/notify'
import { DxPopup } from 'devextreme-vue/popup';
import {
  DxForm,
  DxGroupItem, 
  DxSimpleItem,
  DxButtonItem,
  DxLabel,
  DxItem,
  DxTab,
  DxTabbedItem,
  DxEmptyItem
} from 'devextreme-vue/form';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { DxScrollView } from 'devextreme-vue/scroll-view';
import acceptTbar from '@/components/Settings/Users/Toolbars/AcceptToolbar/AcceptToolbar.vue';
import TopToolbar from '@/components/Settings/Users/Toolbars/TopToolbar/TopToolbar.vue';

export default {
  name: 'Home',
  components: {
    DxButton,
    DxGroupItem,
    DxValidator,
    DxRequiredRule,
    DxScrollView,
    DxSimpleItem,
    DxLabel,
    DxDataGrid,
    DxColumn,
    DxForm,
    DxPopup,
    DxToolbar,
    DxItem,
    acceptTbar,
    DxTab,
    DxTabbedItem
  },
  props:{
      user:{
        type:Object,
        default:()=>{}
      },
      createMode:{
        type:Boolean,
        default:false
      },
      isVisible:{
      type:String,
      default:'hidden'
    }
  },
  data() {
    return {
      errText: "Проверьте заполнение обязательных полей!",
      acceptClick: async  function(e){
        if(this.isNullOrEmpty(this.user.surname)||this.isNullOrEmpty(this.user.account)){
          notify(this.errText)
          return
        }
        if(!this.createMode)
          await this.editUser();      
        else
        {
          if(this.isNullOrEmpty(this.user.password)||this.isNullOrEmpty(this.user.confirmPassword)){
            notify(this.errText)
            return
          }
          await this.createUser();
        }
        this.$emit("accept:click",{user : {}, createMode : false, isVisible : 'hidden'})
      }
      ,
      cancelClick: function(e){
        this.$emit("cancel:click",{user : {}, createMode : false, isVisible : 'hidden'})
      },
      text :""
    }
  },
  
  mounted(){  
  },
  methods: {
    isNullOrEmpty(string){
      return string===null||string===undefined||string===''
    },
    validated(){
      this.user
    },
    textSet(){
    
      if(this.createMode)
        this.text = "Добавление пользователя"
      else 
      this.text = "Редактирование пользователя"
    },
    async createUser(){
      const vm = this
     await this.$http.post('/Users/RegisterUser',
        this.user,
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          console.log(response.data)
          if(response.data.errors.length>0){
            notify(response.data.errors[0].description,"warning", 3000)
          }
        })
        .catch(function (error) {
          console.log(error);          
        });
    },
    async editUser(){
      const vm = this
     await this.$http.post('/Users/EditUserr',
        this.user,
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          console.log(response.data)
          if(response.data.errors.length>0){
            notify(response.data.errors[0].description,"warning", 3000)
          }
        })
        .catch(function (error) {
          console.log(error);          
        });
    },
    contentReady(){

    }
  },
  computed: {
  //   editorOptions: {
  //     disabled: true
  // },
    visibleLogin(){
      this.textSet()
      return !this.createMode// this.editorOptions={ disabled : !this.createMode}
    },

    
  }
}