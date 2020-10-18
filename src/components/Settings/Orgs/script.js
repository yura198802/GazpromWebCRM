import { DxPopup } from 'devextreme-vue/popup';
import {
  DxGroupItem, DxForm,
  DxSimpleItem,
  DxLabel
} from 'devextreme-vue/form';
import {
  DxValidator,
  DxRequiredRule,
  DxCompareRule,
  DxPatternRule,
  DxStringLengthRule,
  DxRangeRule,
  DxAsyncRule
  } from 'devextreme-vue/validator';

import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxEditing,
} from 'devextreme-vue/tree-list';
import DxButton from 'devextreme-vue/button';
//import { DxSelectBox } from 'devextreme-vue/select-box';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { typeLevel } from '@/components/Settings/enums.js';
import notify from 'devextreme/ui/notify'


export default {
  name: 'Home',
  components: {
    DxValidator,
    DxRequiredRule,
    DxPatternRule,
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    DxButton,
    DxEditing,
    DxForm,
    DxGroupItem,
    DxSimpleItem,
    DxLabel,
    DxToolbar,
    DxItem,
    DxPopup,
    TopToolBar: () => import('@/components/Settings/Users/Toolbars/TopToolbar/TopToolbar.vue'),
    AcceptTbar:()=>import('@/components/Settings/Users/Toolbars/AcceptToolbar/AcceptToolbar.vue')
  },
  data() {

    return {
      treeLevelOrgs:'treeOrgs',
      typeLevelOptions:{},
      oktmoPattern:/(^\d{8}$)|(^\d{11}$)/,
      kppPattern:/(^\d{9}$)/,
      innPattern:/(^\d{10}$)|(^\d{12}$)/,
      colCount:2,
      types: typeLevel,
      focusedRowKey:[],
      expandedRowKeys:[],
      isEdit: false,
      isCreate: false,
      addDisabled: true,
      removeDisabled: true,
      orgs: [],
      org: {},
      getParentSelected: 0,
      editorVisible: false,
      notifySave: ``,
      editorShow: false,
      editorCaption:function()
      {
        if (this.isCreate)
        {return "Создание организации"}
        if (this.isEdit)
        {return "Редактирование организации"}
      }
    }
  },
  methods: {
    //#region btnDisabled
    isAddDisabled() {
      return !this.isChief(this.org.parent);
    },
    isRemoveDisabled() {
      if (this.orgs.length === 1)
        return false
      return this.isChief(this.org.parent)
    },
    //#endregion
    //#region grid
    isChief(parent) {
      return parent === 0;
    },
    onFocusedRowChanged(e) {
      this.org = e.row.data;
      this.disabledBtns();
      this.$emit("click:org", this.org)
    },
    onReady(e) {
      if (this.orgs.length === 0) {
        this.expandedRowKeys = []
        this.disabledBtns();
        this.org = {}
       // this.$emit("click:org", { canAdd: add, canRemove: remove, org: this.org });
        return
      }
      if(this.editorShow){
        return
      }
      this.expandedRowKeys = []
      this.expandedRowKeys.push(e.component.getKeyByRowIndex(0));
      this.focusedRowKey = e.component.getKeyByRowIndex(0);
      this.org = e.component.getNodeByKey(this.focusedRowKey).data
      this.disabledBtns();
      this.$emit("click:org", this.org)
    },
    //#endregion
    //#region editor
    notifyError(){
      notify(this.errorMessage, 'error');
      this.errorMessage = ''
    },
    isNullOrEmpty(string){
      return string===null||string===undefined||string===''
    },
    validatorInput(){
      var errValid = 0
      var out = []
      if(this.isNullOrEmpty(this.org.caption))
      {
        errValid++
        out.push("Наименование")
      } 
      if(!this.innPattern.test(this.org.inn))
      {
        errValid++
        out.push("ИНН")
      }      
      if(!this.kppPattern.test(this.org.kpp))
      {
        out.push("КПП")
        errValid++
      }
      if(!this.oktmoPattern.test(this.org.oktmo))
      {
        if(this.org.oktmo!=''){
          out.push("ОКТМО")
          errValid++
        }        
      }
      this.notifySave = `Ошибка ввода! (${out.toString()})`
      if(errValid === 0){
        return true
      }
      notify(this.notifySave,"error")
      return false
    },
    async saveBtnClick() {

  //    if(!this.validatorInput()){
  //      return
   //   }
      if (this.isEdit) {
        await this.editLevelOrg(this.org);
      }
      if (this.isCreate) {
        await this.createLevelOrg(this.org)
        
      }
      if(this.isError){
        this.notifyError();
        this.isError = false;
        return
      }
      this.closeBtnClick()
    },
    closeBtnClick() {
      this.isEdit = false
      this.isCreate = false
      this.editorShow = false
      this.refreshClick()
      //this.treeOrgs.refresh()
      //this.$emit("action:org")
    },
    //#endregion
    disabledBtns() {
      this.aDisabled = this.isAddDisabled();
      this.rDisabled = this.isRemoveDisabled();
    },
    addClick: function () {
      this.isCreate = true
      this.getParentSelected = this.org.id
      var org =
      {
        "Parent": this.getParentSelected,
        "typeLevel": "",
        "caption": "",
 //       "inn": "",
  //      "kpp": "",
 //       "oktmo": ""
      }
      this.org = org
      this.editorShow = true;
    },
    editClick: function () {
      this.isEdit = true
      this.editorShow = true
    },
    doubleClickOrg() {
      this.editClick();
    },
    removeClick: async function () {
      var result = confirm('Удалить организацию?');
      if (!result)
        return
      await this.removeLevelOrg(this.org.id);
      this.refreshClick()
      //this.$emit("action:org")
    },
    async refreshClick(){
      await this.GetLevelOrgs();
      //this.treeOrgs.refresh();
   },
    onClickOrg(e) {
      //не нужен
      this.org = e.org;
      this.aDisabled = e.canAdd;
      this.rDisabled = e.canRemove;
      this.$emit("click:org", e.org)
      //  this.$refs.role.whenUdateOrg(this.org);
      //emit OnRemove
    },
    async removeLevelOrg(idOrg) {
      await this.$http.post(`/LevelOrg/Remove?idOrg=${idOrg}`, '',
        {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`,
          }
        }).then(function (response) {
          console.log(response.data);
          if (response.data.errors.lenght > 0) {
            alert(response.data.errors[0].description);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    async createLevelOrg(levelOrg) {
      const vm = this
     await this.$http.post('/LevelOrg/AddLevelOrg', {
        "Id": undefined,
        "Parent": levelOrg.Parent,
        "TypeLevel": levelOrg.typeLevel,
        "Caption": levelOrg.caption,
  //      "Inn": levelOrg.inn,
  //      "Kpp": levelOrg.kpp,
  //      "Oktmo": levelOrg.oktmo,
        "IsDeleted": levelOrg.isDeleted
      },
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        }).then(function (response) {
          console.log(response.data);
          if(response.data.errors.length>0){
            vm.isError = true  
            vm.errorMessage = response.data.errors[0].description;
            
          }          
        })
        .catch(function (error) {
          console.log(error);
        })
      return
    },
    async editLevelOrg(levelOrg) {
      await this.$http.post('/LevelOrg/Edit',
        {
          "Id": levelOrg.id,
          "Parent": levelOrg.parent,
          "TypeLevel": levelOrg.typeLevel,
          "Caption": levelOrg.caption,
          "Inn": levelOrg.inn,
          "Kpp": levelOrg.kpp,
          "Oktmo": levelOrg.oktmo,
          "IsDeleted": levelOrg.isDeleted
        },
        {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`,
          }
        }).then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    async GetLevelOrgs() {
      const vm = this
     await this.$http.post('/LevelOrg/GetAll', {},
        {
          headers: {
            Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
          }
        })
        .then(function (response) {
          vm.orgs = response.data;
          if (vm.orgs.length === 0) {
            vm.$emit("info:isEmpty", true)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  computed: {
    editorCaptionComputed: function () {
      return this.editorCaption()
    },
    treeOrgs: function() {
      return this.$refs[treeLevelOrgs].instance;
  },
    aDisabled: {
      // геттер:
      get: function () {
        return this.addDisabled
      },
      // сеттер:
      set: function (newValue) {
        this.addDisabled = newValue;
      }
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
    },
  },
  mounted:async function () {
    this.typeLevelOptions = {dataSource: this.types, displayExpr: 'caption', valueExpr: "id", value:2}
    await this.GetLevelOrgs();
  }
}//this.types[this.org.typeLevel].id