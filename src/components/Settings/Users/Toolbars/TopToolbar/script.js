import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import notify from 'devextreme/ui/notify'

export default {
  name: 'Home',
  props: {
    disableBtn:{
      type: Boolean,
      default:false
    },
    removeDisabled:{
      type: Boolean,
      default:false
    },
    editDisabled:{
       type: Boolean,
      default:false
    },
    createDisabled:{
      type: Boolean,
      default:false
    },
    addDisabled:{
      type: Boolean,
      default:false
    },
    acceptDisabled:{
      type: Boolean,
      default:false
    },
    visibleToolbar: {
      type: true
    },
    visibleCreate:{
      type: Boolean,
      default:false
    },
    visibleAccept:{
      type: Boolean,
      default:false
    },
    visibleAdd:{
      type: Boolean,
      default:false
    },
    visibleEdit:{
      type: Boolean,
      default:false
    },
    visibleRemove:{
      type: Boolean,
      default:false
    },
    visibleRefresh:{
      type: Boolean,
      default:false
    },
    textCreate:{
      type: String,
      default:''
    },
    textAdd:{
      type: String,
      default:''
    },
    textEdit:{
      type: String,
      default:''
    },
    textRemove:{
      type: String,
      default:''
    },
    textRefresh:{
      type: String,
      default:''
    },
    hintCreate:{
      type: String,
      default:'Создать'
    },
    hintAdd:{
      type: String,
      default:'Добавить'
    },
    hintEdit:{
      type: String,
      default:'Изменить'
    },
    hintRemove:{
      type: String,
      default:'Удалить'
    },
    hintRefresh:{
      type: String,
      default:'Обновить'
    },
    heightToolbar: {
      type: Number
    }
  },
  components:
  {
    DxToolbar,
    DxItem
  },
  data() {
    return {
      refreshButtonOptions: {
        icon: 'refresh',
        hint: this.hintRefresh,
        text: this.textRefresh,
        type: "default",
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("refresh:click");
        }
      },
      createButtonOptions: {
        icon: 'plus',
        hint: this.hintCreate,
        text: this.textCreate,
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("plus:click");
        }
      },
      addButtonOptions: {
        icon: 'plus',
        hint: this.hintAdd,
        text: this.textAdd,
        type: "success",
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("add:click");
        }
      },
      editButtonOptions: {
        icon: 'edit',
        hint: this.hintEdit,
        text: this.textEdit,
        type: "default",
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("edit:click");
        }
      },
      removeButtonOptions: {
        icon: 'remove',
        hint: this.hintRemove,
        text: this.textRemove,
        type: "danger",
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("remove:click")
        }
      },
      acceptOptions: {
        icon: 'todo',
        hint: "Принять",
        text: "",
        type: "success",
        stylingMode:"outlined",
        onClick: () => {
          this.$emit("accept:click");
        }
      }
    }
  },
  methods: {

  }
}

