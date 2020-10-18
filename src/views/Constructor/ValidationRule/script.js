import {
  DxTreeList,
  DxGrouping,
  DxColumn,
  DxLookup,
  DxHeaderFilter,
  DxScrolling,
  DxSearchPanel,
  DxFilterRow
} from 'devextreme-vue/tree-list';
import {DxToolbar, DxPopup, DxButton} from 'devextreme-vue';
import {DxLoadPanel} from 'devextreme-vue/load-panel';
import DxValidationGroup from 'devextreme-vue/validation-group';
import {
  DxForm,
  DxSimpleItem,
  DxButtonItem,
  DxRequiredRule,
  DxEmptyItem,
  DxItem,
  DxLabel,
  DxTabbedItem,
  DxTab
} from 'devextreme-vue/form';

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
    DxItem,
    DxScrolling
  },
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
      typeValidation: [
        {id: 1, caption: 'Sql'},
        {id: 2, caption: 'Component'}
      ],
      typeReturnValidation: [
        {id: 1, caption: 'Boolean'},
        {id: 2, caption: 'Model'}
      ],
      parentGroup: [],
      typeValidationOptions: {},
      typeReturnValidationOptions: {},
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
        }],
    }
  },
  mounted() {
    this.typeValidationOptions = {dataSource: this.typeValidation, displayExpr: 'caption', valueExpr: 'id'};
    this.typeReturnValidationOptions = {dataSource: this.typeReturnValidation, displayExpr: 'caption', valueExpr: 'id'};
  },
  methods: {
    onToolbarPreparing(e) {
      for (let index = this.toolbarContent.length - 1; index >= 0; --index) {
        let element = this.toolbarContent[index];
        e.toolbarOptions.items.unshift(element);
      }
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
      this.$http.post(`/CrmDesigner/GetValidationRule?idForm=${id}`, '', {
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
      this.fieldModelData = {formModelId: this.templateData.idModel};
      this.captionEditFormModel = 'Добавление нового правила';
      this.isVisibleEditFormModel = true;
    },
    editField: function () {
      this.fieldModelData = JSON.parse(JSON.stringify(this.selectedFieldModelData));
      this.captionEditFormModel = `Редактирование правила валидации: ${this.fieldModelData.displayName} (${this.fieldModelData.name})`;
      this.isVisibleEditFormModel = true;
    },
    removeField: function () {
      let result = confirm("Вы уверены, что хотите удалить запись?", "Внимание");
      if (result == false)
        return;

      this.$http.post(`/CrmDesigner/RemoveValidationRule?id=${this.selectedFieldModelData.id}`, '', {
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
      this.$http.post(`/CrmDesigner/SaveValidationModel`, this.fieldModelData, {
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
    }
  }
}
