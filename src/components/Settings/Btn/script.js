import DxButton from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify'


export default {
  name: 'Home',

  components:
  {
    DxButton
  },
  props: {

    stylingMode: {
      type: String,
      default: "contained"//outlined
    },
    text: {
      type: String,
      default: ""
    },
    hint: {
      type: String,
      default: "Отмена"
    },
    icon: {
      type: String,
      default: "remove"
    },
    type: {
      type: String,
      default: "normal"//success, danger
    },
    hAlignment: {
      type: String,
      default: "right"
    },
    width: {
      type: String,
      default: "140"
    },
  isShow: {
    type: Boolean,
    default: true
  },
  notify:{
    type:String,
    default:"Отмена"
  },
  isNotify:{
default:false
  }
},
data() {
  return {
    onClick: () => {
      this.$emit("click:btn")
      //this.function
     // if(this.isNotify){
      //  notify(this.notify)
      }      
    }
},
computed: {
}
  ,
methods: {
}
}

