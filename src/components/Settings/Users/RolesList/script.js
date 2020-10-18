import notify from 'devextreme/ui/notify'
import TopToolbar from '../Toolbars/TopToolbar/TopToolbar.vue'
import { DxDataGrid, DxEditing, DxSelection, DxColumn } from 'devextreme-vue/data-grid';



export default {
  name: 'Home',
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    TopToolbar,
    EditorRole: () => import('@/components/Settings/Users/RolesList/EditorRole/EditorRole'),
  },
  props: {
    isRerand: {
      type: Boolean, default: false
    },
    isShow: {
      type: Boolean,
      default: true
    },
    org: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  data() {
    return {
      updater() {
        return this.org
      },
      isDisableBtns: function () {
        return this.role.id === undefined
      },
      removeDisabled: true,
      textRemove: "",
      textAdd: "",
      isUpdating: true,
      showEditor: false,
      widhtDefault: 450,
      focusedRowKey: Number,
      roles: [],
      role: {},
      startEditAction: 'dblClick',
      isCreate:false
    }
  },
  methods: {
    addClick() {
      this.role = {
        "IdLevelorg": this.org.id,
        "name": ""
      }
      this.isCreate = true
      this.showEditor = true
    },
    editClick(){
      this.isCreate = false
      this.showEditor = true
    },
    onCreateRole() {
      this.$emit("action:role")
    }, 
    editRole(e) {
      this.$emit("action:role")
    },
    onCloseEditor(e) {
      this.isCreate = e
      this.showEditor = e
    },
    rowDblClick(e){
      this.isCreate = false
      this.role = e.data
      this.showEditor = true
    },
    async removeClick(e) {
      var result = confirm('Удалить роль?');
      if (!result)
        return
      await this.remove(this.role);
      this.$emit("action:role")
    },
    //#region  Grid
    async refresh(org) {
      if (org.id === undefined) {
        this.roles = []
        this.role = {}
        this.$emit("click:role", this.role);
        return
      }
      await this.initRoles(org)
      if (this.roles.length === 0) {
        this.rDisabled = true;
        this.role = {}
        this.$emit("click:role", this.role);
        return
      }
      this.rDisabled = false;
    },
    onReady(e) {
      if (this.roles.length === 0) {
        this.rDisabled = true;
        return
      }
      if(this.showEditor){
        return
      }
      this.focusedRowKey = e.component.getKeyByRowIndex(0); 
      this.rDisabled = false;
    },
    onFocusedRowChanged(e) {      
      this.role = e.row.data;
      this.isDisableBtns()
      this.$emit("click:role", this.role);
    },
    //#endregion
    initRoles: async function (org) {
      const vm = this
      await this.$http.post(`/Roles/GetRolesByOrg?idOrg=${org.id}`,
        ''
        ,
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          vm.roles = response.data;
        })
        .catch(function (error) {
          console.log(error);
          vm.roles = []
        });
    },
    async remove(role) {
      const vm = this
      await this.$http.post(`/Roles/Remove?idRole=${role.id}`,
        '',
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {
    orgComputed: function () {
      this.role = {}
      return this.updater()
    },

    rDisabled: {
      // геттер:
      get: function () {
        return this.removeDisabled
      },
      // сеттер:
      set: function (newValue) {
        this.removeDisabled = newValue;
      }
    }
  },
  mounted: function () {
  }
}


/*async AddUserToRole(e) {
  this.role = e
  this.usersToRoleVisible = false
  this.$refs["utr"].idRole = e.id;
  this.$refs["utr"].nameRole = e.name;
  //this.$refs["utr"].getTitle();
  await this.$refs["utr"].initUsers();
  this.usersToRoleVisible = true
},
editButtons: [{
  caption: "Добавление пользователя",
  hint: 'Добавить пользователя к роли',
  icon: 'add',
  visible: true,
  onClick: () => this.AddUserToRole()
}],*/