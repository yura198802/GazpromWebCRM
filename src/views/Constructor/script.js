import { DxButton,DxDrawer, DxToolbar,DxPopup,DxSelectBox} from 'devextreme-vue';
import DxDataGrid from 'devextreme-vue/data-grid';
import {DxTabPanel} from 'devextreme-vue/tab-panel';
import {
  DxGroupItem,DxItem,DxForm,
  DxSimpleItem,
  DxButtonItem,
  DxLabel,
  DxRequiredRule,
  DxEmptyItem
} from 'devextreme-vue/form';
import { DxTreeList, DxEditing, DxColumn, DxLookup,DxSearchPanel } from 'devextreme-vue/tree-list';
import DxValidationGroup from 'devextreme-vue/validation-group';
import Field from './FieldModel/Field.vue';
import Button from './ButtonModel/Button.vue';
import ValidationRule from './ValidationRule/ValidationRule';

export default {
  components: {
    DxButton,DxDrawer,DxToolbar,DxColumn,DxTreeList, DxEditing, DxRequiredRule, DxLookup,DxSearchPanel,DxPopup,DxForm,DxSimpleItem,DxLabel,DxButtonItem,
    DxGroupItem,DxEmptyItem,DxValidationGroup,DxItem,DxSelectBox,DxTabPanel,Field,DxDataGrid,Button,ValidationRule
  },
  data() {
    return {
      searchMode: 'contains',
      models: [],
      typeForms:[],
      selectedOpenMode: 'shrink',
      captionEditFormModel: '',
      openState: true,
      heightTree:window.innerHeight /1.25,
      selectedFormModel:{},
      isVisibleEditFormModel:false,
      isVisibleBtnEditor:false,
      formModelData:{},
      typeEditor: [
        {id:3, displayName:'Список с редактированием'},
        {id:2, displayName:'Только форма редактирования'},
        {id:1, displayName:'Только список'}
      ],
      toolbarContent: [],
      typeFormOptions: {},
      typeEditorOptions: {},
      optionBtnSave: {
        icon:'save',
        text: 'Сохранить',
        type: 'success',
        useSubmitBehavior: true
      },
      optionBtnClose: {
        icon:'close',
        text: 'Выход',
        type:'normal'
      }

    };
  },
  mounted(){
    this.getTypeForm();
    this.loadcomponent();
    this.typeEditorOptions = { dataSource: this.typeEditor,displayExpr:'displayName', valueExpr:'id'};
    this.createrEditroFormModelBtn();
  },
  methods:{
    createrEditroFormModelBtn: function()
    {
        this.toolbarContent = [{
          widget: 'dxButton',
          location: 'before',
          options: {
            icon: 'menu',
            onClick: () => this.openState = !this.openState
          }
        },
        {
          widget: 'dxButton',
          location: 'before',
          hint:'Добавление новой бизнес модели',
          options: {
            icon: 'add',
            onClick: () => this.addFormModel()
          }
        },
        {
          widget: 'dxButton',
          location: 'before',
          hint:'Редактировать бизнес модели',
          options: {
            visible:this.isVisibleBtnEditor,
            icon: 'edit',
            onClick: () => this.editnFormModel()
          }
        },
        {
          widget: 'dxButton',
          location: 'before',
          hint:'Удаление бизнес модели',
          options: {
            visible: this.isVisibleBtnEditor,
            icon: 'remove',
            onClick: () => this.removeFromModel()
          }
        },
        {
          widget: 'dxButton',
          location: 'before',
          hint:'Обновить данные',
          options: {
            icon: 'refresh',
            onClick: () => this.loadcomponent()
          }
        }];
    },
     loadcomponent: function(){
        this.models = [];
        this.$http.post('/CrmDesigner/GetSolutionModel', '', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
        .then((response) => {
          this.models = response.data;
          if (this.selectedFormModel.id == null)
          this.selectedFormModel = this.models[0];
          if (this.selectedFormModel.idModel == -1)
            this.isVisibleBtnEditor = false;
          else this.isVisibleBtnEditor = true;
          this.$refs.fieldGrid.loadData(this.selectedFormModel);
          this.$refs.buttonGrid.loadData(this.selectedFormModel);
          this.$refs.validationRule.loadData(this.selectedFormModel);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onSelectFormByTreeList:function(e) {
      this.selectedFormModel = e.row.data;

      if (this.selectedFormModel.idModel == -1)
        this.isVisibleBtnEditor = false;
      else this.isVisibleBtnEditor = true;

      this.createrEditroFormModelBtn();

      this.$refs.fieldGrid.loadData(this.selectedFormModel);
      this.$refs.buttonGrid.loadData(this.selectedFormModel);
    },
    getTypeForm:function(e) {
      this.$http.post('/CrmDesigner/GetTypeForms', '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
      .then((response) => {
        this.typeForms = response.data;
        this.typeFormOptions= { dataSource: this.typeForms,displayExpr:'displayName', valueExpr:'id'};
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    editnFormModel()
    {
      this.$http.post(`/CrmDesigner/GetFormModelByEdit?id=${this.selectedFormModel.idModel}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
      .then((response) => {
        this.formModelData = response.data;
        this.isVisibleEditFormModel = true;
        this.captionEditFormModel = `Редатирование модели "${this.formModelData.caption}"`
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    addFormModel()
    {
      this.formModelData = {};
      this.isVisibleEditFormModel = true;
      this.captionEditFormModel = 'Добавление новой бизнес модели';
    },
    addItem:function()
    {
      var element = {id:(this.models.length +1), text:"новый элемент", expanded: true};
      this.models.push(element);
    },
    removeFromModel:function(e)
    {
      let result = confirm("Вы уверены, что хотите удалить запись?", "Внимание");
      if (result == false)
        return;

      this.$http.post(`/CrmDesigner/RemoveFormModel?id=${this.selectedFormModel.idModel}`, '', {
        headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
        .then((response) => {
          this.models.splice(this.models.indexOf(this.selectedFormModel),1);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveFormModel:function(e)
    {
      let result = e.validationGroup.validate();
      if (result.isValid == false)
        return;
      this.$http.post(`/CrmDesigner/SaveFormModel`, this.formModelData, {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
        .then((response) => {
          this.isVisibleEditFormModel = false;
          this.loadcomponent();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    exitFormModel:function()
    {
      this.isVisibleEditFormModel = false;
    }
  }
}
