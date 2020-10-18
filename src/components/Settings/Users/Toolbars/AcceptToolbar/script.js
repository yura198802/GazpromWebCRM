import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import notify from 'devextreme/ui/notify'


export default {
  name: 'Home',
  
  components:
  {
    DxToolbar,
    DxItem
  },
  props: {    
    visibleToolbar: {
      value: true,
      required:true
    },
    visibleClose: {
      type:Boolean,
      default:true
    },
    visibleSave: {
      type:Boolean,
      default:true
    },
    textSave:{
      type:String,
      default:"Сохранить"
    },
    textClose:{
      type:String,
      default:"Отмена"
    },
    save: {
      type: Function,
      required:true,
      defalut: () => { }
    },
    notifySave:{
      type:String,
      default:"Сохранить"
    },
    close: {
      type: Function,
      required:true,
      defalut: () => { }
    }
  },
  data() {
    return {
      saveBtnOptions:
      {
        id: "saveBtn",
        text: this.textSave,
        hint: "Сохранить",
        icon: "save",
        type: "success",
        width:"auto",  //"140"      
        onClick: () => {
          this.save();
          
        }
      },
      closeBtnOptions:
      {
        id: "closeBtn",
        text: this.textClose,
        hint: "Отмена",
        icon: "remove",
        type: "danger",
        width:"140",
        onClick: () => {
          this.close()       
        }
      }
    }
  },
  computed:{
  }
  ,
  methods: {
  }
}

