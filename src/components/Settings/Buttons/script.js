import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxEditing
} from 'devextreme-vue/tree-list';
import notify from 'devextreme/ui/notify'
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { access } from '@/components/Settings/enums.js';

export default {
  name: 'Home',
  components: {
    DxLookup,
  DxEditing,
    DxToolbar,DxItem,
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection
  }, props: {
    role:{
      type:Object,
      default:()=>{}
    },
    isShow:{
      type:Boolean,
      defalut:true
    }
  },
  data() {
    return {
      access:access,
      disabled:function(){
        if(this.btns.length>0){
          this.disable = this.roleId === -1
        }
        else{
          this.disable = true
        }
      },
      disable:true,
      show: this.isShow,
      btns: [],
      roleId:-1,
      height: window.innerHeight / 1.12 - 150,
      acceptOptions: {
        icon: 'todo',
        hint: "Принять",
        text: "",
        type: "success",
        stylingMode:"outlined",
        onClick: () => {
          this.bindSelectedToRole();
        }
      }
    }
  },
  methods: {
    async initialize(id){
      this.btns=[]
      await this.loadBtns(id)
      this.disabled() 
    },
    bindSelectedToRole() {
      this.bindModesToRole()
    },
    bindModesToRole() {
      if (this.roleId === undefined) {
        return
      }
      this.$http.post(`/ButtonsSet/EditAccess?idRole=${this.roleId}&typeEditor=1`, this.btns, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          notify(`${response.status}(${response.statusText})` )
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
          this.btns = []
        });
    },
    loadBtns:async function(idRole)
    {
      if (idRole === undefined) {
        this.btns = []
        return
      }
      this.roleId=idRole
      await this.$http.post(`/ButtonsSet/GetTree?idRole=${idRole}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.btns = response.data;
        })
        .catch(function (error) {
          console.log(error);
          this.btns = []
        });
    },
  }, computed: {
    acceptDisabled(){
      this.disabled();
      return this.disable;
    }
  },
  mounted: function () {
}
}