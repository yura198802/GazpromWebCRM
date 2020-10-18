

import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import notify from 'devextreme/ui/notify'
import { DxPopup } from 'devextreme-vue/popup';
import {
  DxGroupItem, DxForm,
  DxSimpleItem,
  DxButtonItem,
  DxLabel,
  DxRequiredRule,
  DxEmptyItem
} from 'devextreme-vue/form';
import { DxDataGrid, DxEditing, DxSelection, DxColumn } from 'devextreme-vue/data-grid';
import acceptTbar from '@/components/Settings/Users/Toolbars/AcceptToolbar/AcceptToolbar.vue';
import dxButton from 'devextreme/ui/button';



export default {
  name: 'Home',
  components: {
    DxSimpleItem,
    DxLabel,
    DxDataGrid,
    DxColumn,
    DxForm,
    DxPopup,
    DxToolbar,
    DxItem,
    acceptTbar,
    DxSelection,
    DxEditing
  },
  props: {
    role: {
      type: Object,
      required: true,
      default: () => { }
    },
    isShow: {
      value: false
    }
  },
  data() {
    return {
      selectedUsers:[],
      idRole:-1,
      currentRole: this.role,
      nameRole:"",
      textSave: "Добавить пользователя",
      users: [],
      usersIds: [],
      selectedUser: [],
      idR: -1,
      vis: function () {
        if (this.isShow) {
          return true;
        }
        return false
      },
      groupCaption: function () {
        return `Добавление пользователей к роли(${this.nameRole}).`
      },
      users: [],
      widhtDefault: 450,
      showCloseBtn: false,
      showSaveBtn: false
    }
  },
  methods: {
    selectionChanged({ selectedRowsData }) {
      // this.users = selectedRowsData
      //this.$emit("users-selection-changed", { role: this.currentRole })
    },
    onSelectionChanged({ selectedRowsData }) {
      this.selectedUsers = selectedRowsData
    },
    async saveBtnClick() {
      this.selectedUsers.forEach(element => {
        this.usersIds.push(element.id)
      });
      await this.addUsersToRole();
      this.$parent.$parent.$refs.usersList.initUsers(this.role);
      this.show = false;
      this.selectedUsers = [];
      this.usersIds = [];
    },
    closeBtnClick() {
      this.show = false;
    },
    initUsers: async function () {
      const vm = this
      await this.$http.post(`/Users/GetUsers`,
        ''
        ,
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          vm.users = response.data;
        })
        .catch(function (error) {
          console.log(error);
          vm.users = []
        });
    },
    addUsersToRole: async function () {
      const vm = this
      await this.$http.post('/Roles/AddUserToRole',
        {
          "IdUsers": this.usersIds,
          "IdRole": this.idRole
        },
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
    }
  },
  computed: {
    show: {
      get: function () {
        return this.vis()
      }, set: function (value) {
        this.$emit('update:is-show', { show: value })
      }
    }
    ,
    getTitle: function () {
      return this.groupCaption();
    },
    usersGridComputed: function () {
      return this.$refs["usersGrid"].instance;
    }
  }
}