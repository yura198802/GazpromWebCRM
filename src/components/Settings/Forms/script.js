
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
    role: {
      type: Object,
      default: ()=>{}
    },
     isShow: {
   type: Boolean,
   defalut: true
     }
  },
  data() {
    return {
      access:access,
      show: this.isShow,
      forms: [],
      roleId:-1,
      selectedRowKeys: [],
      height: window.innerHeight / 1.12 - 150,
      disable:true,
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
      this.forms=[]      
      await this.loadForms(id);
      this.acceptDisabled()      
    },
    refresh() {
      this.loadForms(this.role.id)
    },
    bindSelectedToRole() {
      this.bindModesToRole()
    },
    bindModesToRole() {
      if (this.roleId === undefined) {
        this.forms = []
        return
      }
      if (this.forms.lentgh === 0) {
        this.forms = []
        return
      }
      this.$http.post(`/ModesSet/EditAccess?idRole=${this.roleId}`, this.forms, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
          this.forms = []
        });
    },
    loadForms:async function (idRole) {
      if (idRole === undefined || idRole === null) {
        return
      }
      this.roleId = idRole
      await this.$http.post(`/ModesSet/GetTree?idRole=${idRole}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.forms = response.data;
        })
        .catch(function (error) {
          console.log(error);
          this.forms = []
        });
    },
  }, computed: {
    acceptDisabled(){
      if(this.forms.length>0)
      return this.roleId === -1
    return true
    }
  }
}