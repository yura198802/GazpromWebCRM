import {
  DxTreeList,
  DxGrouping,
  DxColumn,
  DxLookup,
  DxHeaderFilter,
  DxScrolling,
  DxSearchPanel,
  DxFilterRow,
} from 'devextreme-vue/tree-list';
import { DxDropDownBox } from 'devextreme-vue/drop-down-box';
import {DxToolbar, DxPopup, DxButton} from 'devextreme-vue';
import {DxLoadPanel} from 'devextreme-vue/load-panel';
import DxValidationGroup from 'devextreme-vue/validation-group';
import {
  DxForm,
  DxSimpleItem,DxGroupItem,
  DxButtonItem,
  DxRequiredRule,
  DxEmptyItem,
  DxItem,
  DxLabel,
  DxTabbedItem,
  DxTab
} from 'devextreme-vue/form';
import awaitAsyncGenerator from "@babel/runtime-corejs2/helpers/esm/awaitAsyncGenerator";

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxToolbar,
    DxLookup,
    DxHeaderFilter,
    DxSearchPanel,
    DxLoadPanel,
    DxTabbedItem,
    DxTab,
    DxFilterRow,
    DxPopup,
    DxForm,
    DxSimpleItem,
    DxLabel,
    DxButtonItem,
    DxValidationGroup,
    DxButton,
    DxRequiredRule,
    DxEmptyItem,
    DxGrouping,
    DxItem,DxGroupItem,
    DxScrolling,DxDropDownBox
  },computed: {
    dataGrid: function () {
      return this.$refs["dataGrid"].instance;
    }},
  props: {
    templateData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      models: [],
      heightControl: window.innerHeight / 1.12,
      typeControl: [
        {id: 1, caption: 'Текстовое поле'},
        {id: 2, caption: 'Редактирование даты'},
        {id: 3, caption: 'Выпадающий список'},
        {id: 4, caption: 'Многострочный текстовый помпонент'},
        {id: 5, caption: 'Компонент ввода числа'},
        {id: 6, caption: 'Выбор из справочника'},
        {id: 7, caption: 'Галочка'},
        {id: 9, caption: 'Фотография'},
        {id: 8, caption: 'Таблица деталей'}
      ],
      typeAccec: [
        {id: 3, caption: 'Запись и чтение'},
        {id: 2, caption: 'Только чтение'},
        {id: 1, caption: 'Нет доступа'}
      ],
      fieldModelByDetail: [],
      typeProfileForm: [
        {id: 1, caption: 'Не обязательно для заполнения'},
        {id: 2, caption: 'Обязательно для заполнения'}
      ],
      typeGroup: [
        {id: 0, caption: 'Нет'},
        {id: 1, caption: 'Группа'},
        {id: 2, caption: 'Вкладки'}
      ],
      parentGroup: [],
      fieldModelByDetailOptions: {},
      typeControlOptions: {},
      typeAccecOptions: {},
      typeProfileFormOptions: {},
      typeGroupOptions: {},
      parentGroupOptions: {},
      captionEditFormModel: '',
      loadingVisible: false,
      isVisibleEditFormModel: false,
      fieldModelData: {},
      selectedFieldModelData: {},
      editButtons: [{
        hint: 'Редактировать',
        icon: 'edit',
        onClick: () => this.editField()
      }, {
        hint: 'Удалить',
        icon: 'remove',
        onClick: () => this.removeField()
      }],
      focusedRowKey: 1,
      toolbarContent: [
        {
          widget: 'dxButton',
          location: 'after',
          hint: 'Добавить',
          options: {
            icon: 'add',
            onClick: () => this.addField()
          }
        },
        {
          widget: 'dxButton',
          location: 'after',
          hint: 'Обновить данные',
          options: {
            icon: 'refresh',
            onClick: () => this.loadData()
          }
        },
        {
          widget: 'dxButton',
          location: 'after',
          hint: 'Генерация полей из схемы БД',
          options: {
            icon: 'variable',
            onClick: () => this.generateFields()
          }
        }],
    }
  },
  mounted() {
    this.typeAccecOptions = {dataSource: this.typeAccec, displayExpr: 'caption', valueExpr: 'id'};
    this.typeProfileFormOptions = {dataSource: this.typeProfileForm, displayExpr: 'caption', valueExpr: 'id'};
    this.typeControlOptions = {dataSource: this.typeControl, displayExpr: 'caption', valueExpr: 'id'};
    this.typeGroupOptions = {dataSource: this.typeGroup, displayExpr: 'caption', valueExpr: 'id'};

  },
  methods: {
    onToolbarPreparing(e) {
      for (let index = this.toolbarContent.length - 1; index >= 0; --index) {
        let element = this.toolbarContent[index];
        e.toolbarOptions.items.unshift(element);
      }
    },
    onRowPrepared:function(e)
    {
      if (e.rowType != "data")
        return;
      if (e.data.typeGroup == 0)
        return;
      e.rowElement.bgColor = '#ebebeb';
      e.rowElement.style.fontWeight = 'bold';
      console.log(e);
    },
    loadData: function (e) {
      let id = -1;
      if (e != null)
        id = e.idModel;
      if (this.templateData.idModel != null && e == null)
        id = this.templateData.idModel;

      if (id == -1)
        return;

      this.loadingVisible = true;
      this.models = [];
      this.$http.post(`/CrmDesigner/GetFieldByForms?idForm=${id}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.models = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.loadingVisible = false;
    },
    addField: function () {
      this.loadinfoByEdit();
      this.fieldModelData = {formModelId: this.templateData.idModel};
      this.captionEditFormModel = 'Добавление нового поля';
      this.isVisibleEditFormModel = true;
    },
    loadinfoByEdit()
    {
      this.$http.post(`/CrmDesigner/GetFormsAsunc`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.fieldModelByDetail = response.data;
          console.log(this.fieldModelByDetail);
          this.fieldModelByDetailOptions = {dataSource: this.fieldModelByDetail, displayExpr: 'tableName', valueExpr: 'id'};
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editField: function () {
        this.loadinfoByEdit();

        this.$http.post(`/CrmDesigner/GetFieldByFormsOnlyGroup?idForm=${this.templateData.idModel}`, '', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
          .then((response) => {
            this.parentGroup = response.data;
            this.parentGroupOptions = {
              dataSource: this.parentGroup,
              displayExpr: 'displayName',
              valueExpr: 'id',
              showClearButton: true
            };
          })
          .catch(function (error) {
            console.log(error);
          });
      this.fieldModelData = JSON.parse(JSON.stringify(this.selectedFieldModelData));
      this.captionEditFormModel = `Редактирование поля: ${this.fieldModelData.displayName} (${this.fieldModelData.name})`;
      this.isVisibleEditFormModel = true;
    },
    removeField: function () {
      let result = confirm("Вы уверены, что хотите удалить запись?", "Внимание");
      if (result == false)
        return;

      this.$http.post(`/CrmDesigner/RemoveFieldModel?id=${this.selectedFieldModelData.id}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.models.splice(this.models.indexOf(this.selectedFormModel), 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveModel: function (e) {
      let result = e.validationGroup.validate();
      if (result.IsValid == false)
        return;
      this.$http.post(`/CrmDesigner/SaveFieldByForm`, this.fieldModelData, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.isVisibleEditFormModel = false;
          this.loadData();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeFormEditor: function () {
      this.isVisibleEditFormModel = false;
    },
    onFocusedRowChanged(e) {
      this.selectedFieldModelData = e.row.data;
    },
    generateFields: function () {
      let result = confirm("Сгенерировать данные из схемы БД?", "Внимание");
      if (result == false)
        return;
      this.$http.post(`/CrmDesigner/GenerateFiledsMySql?formId=${this.templateData.idModel}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.loadData();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
