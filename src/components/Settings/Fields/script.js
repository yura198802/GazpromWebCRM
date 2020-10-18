
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
    DxEditing,
    DxLookup,
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
      disabled:function(){
        if(this.fields.length>0){
          this.disable = this.roleId === -1
        }
        else{
          this.disable = true
        }
      },
      disable:true,
      show: this.isShow,
      fields: [],
      roleId:-1,
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
      this.fields=[]      
      await this.loadForms(id);
      this.disabled()      
    },
    refresh() {
      this.loadForms(this.role.id)
    },
    bindSelectedToRole() {
      this.bindModesToRole()
    },
    bindModesToRole() {
      if (this.roleId === undefined) {
        this.fields = []
        return
      }
      if (this.fields.length === 0) {
        this.fields = []
        return
      }
      this.$http.post(`/FieldsSet/EditAccess?idRole=${this.roleId}`, this.fields, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
          this.fields = []
        });
    },
    loadForms:async function (idRole) {
      if (idRole === undefined || idRole === null) {
        return
      }
      this.roleId = idRole
      await this.$http.post(`/FieldsSet/GetTree?idRole=${idRole}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.fields = response.data;
        })
        .catch(function (error) {
          console.log(error);
          this.fields = []
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