import notify from 'devextreme/ui/notify'
import { DxDataGrid, DxEditing, DxSelection, DxColumn,DxPaging,  DxSummary,
  DxTotalItem } from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import { DxPopup } from 'devextreme-vue/popup';

export default {
  name: 'Home',
  components: {
    Editor: () => import('@/components/Settings/Grids/UsersGrid/Editor/editorUsers'),
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxEditing,
    DxButton,
    DxPopup,
    DxPaging,
    DxSummary,
  DxTotalItem
  },
  props: {    
  },
  data() {
    return {   
      isShowManager:false,      
      isVisibleEditor:'hidden',
      createMode:false,
      isShowEditor:false,
      user: {},
      freeUsers:[],
      accounts:[],
      users:[],
      usersIds:[],
      roleId:-1
    }
  },
  methods: {
    async initialize(id){
      if(Number(id)){
        this.roleId = id
      }
      else{
        this.roleId = -1
      }
      await this.initUsersData(this.roleId)
    },
    acceptClick(e){
      if(this.isShowEditor){
        this.isShowEditor=!this.isShowEditor
        return
      }
      this.createMode = e.createMode,
      this.user = e.user
      this.isVisibleEditor = e.isVisible
      this.initFreeUsersData()
    },
    cancelClick(e){
      if(this.isShowEditor){
        this.isShowEditor=!this.isShowEditor
        return
      }
      this.createMode = e.createMode,
      this.user = e.user
      this.isVisibleEditor = e.isVisible
    },
    onManageBtnClick(){
      this.isShowManager = true
    },
    async removeClick(){
      var result = confirm("Удалить пользователя из системы?")
      if (!result)
        return
      this.accounts = []
      this.accounts.push(this.user.account)
      await this.removeUsers()
      await this.initFreeUsersData()
    },
    async minusClick(){
      var result = confirm("Удалить пользователя из роли?")
      if (!result)
        return
      await this.removeUserFromRole();
      await this.initUsersData(this.roleId);
    },
    async bindClick(){
      this.usersIds.push(this.user.id)
      await this.addUsersToRole()
      this.user={}
      await this.initFreeUsersData();
      this.createMode = false;
      this.isVisibleEditor='hidden'
    },
    onEditBtnClickM(){
      this.createMode = false;
      this.isVisibleEditor='visible'
    },
    onCreateBtnClick(){
      this.createMode = true
      this.user = {};
      this.isVisibleEditor = 'visible';
    },
    async onHidingManager(e){
      this.user ={}
      this.isVisibleEditor = 'hidden';
      await this.initUsersData(this.roleId)
    },
    showEditor(){
      this.isVisibleEditor = 'visible';
      this.createMode=false
      this.isShowEditor=true
    },
    async onShowingManager(){
      this.user={}
      this.isVisibleEditor='hidden'
      await this.initFreeUsersData()
    },
    onFocusedCellChanging(e) {
      this.createMode = false
      this.user = e.rows[e.newRowIndex].data
      this.$emit("click:user", this.user);
    },
    onFocusedFreeChanging(e){
      this.createMode = false
      this.user = e.rows[e.newRowIndex].data
      this.$emit("click:free-user", this.user);
    }, 
    initFreeUsersData:async function () {
      const vm = this
     await this.$http.post(`/Users/GetFree`, '',
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          vm.freeUsers = response.data;
        })
        .catch(function (error) {
          console.log(error);
          vm.freeUsers = []
        });
  },
    initUsersData:async function (idRole) {
      //this.roleId = idRole
      if(this.roleId === -1){
        this.users = []
        this.user = {}
        return
      }
      const vm =  this
      await this.$http.post(`/Users/GetUsersByRole?idRole=${idRole}`, '',
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
  removeUsers: async function () {
    const vm = this
    await this.$http.post('/Users/RemoveUserss',
      this.accounts,
      {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }
      })
      .then(function (response) {
        response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  addUsersToRole: async function () {
    const vm = this
    await this.$http.post(`/Users/AddUserToRole?idRole=${this.roleId}`,
     this.usersIds,
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
  removeUserFromRole: async function () {
    const vm = this 
    await this.$http.post(`/Users/RemoveUserFromRole?idUser=${this.user.id}&idRole=${this.roleId}`,
      '',
      {
        headers: {
          Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
        }
      })
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  },
  computed: {
    disableBtn(){
      return this.user.account === undefined
    },
    disableBind(){
      return  this.roleId === -1||this.user.account === undefined
    }
  }
}

/* если делать множественный выбор
переменная для хранения выбранных записей: this.selectedUsers = [];data

обработчик события при изменении выбора: onSelectionChanged({ selectedRowsData }) {
      this.selectedUsers = selectedRowsData
    },

формирования массива ids для удаления this.selectedUsers.forEach(element => {
  this.usersIds.push(element.id)
});*/