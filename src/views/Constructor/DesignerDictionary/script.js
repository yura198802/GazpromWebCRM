import {
  DxDataGrid, DxColumn, DxLookup, DxHeaderFilter, DxSearchPanel, DxFilterRow, DxScrolling, DxExport,
  DxSummary, DxTotalItem, DxSelection, DxPaging, DxPager
} from 'devextreme-vue/data-grid';
import {DxToolbar, DxPopup, DxButton} from 'devextreme-vue';
import {DxTabPanel} from 'devextreme-vue/tab-panel';
import {DxLoadPanel} from 'devextreme-vue/load-panel';
import DxValidationGroup from 'devextreme-vue/validation-group';
import {DxForm, DxSimpleItem, DxButtonItem, DxRequiredRule, DxEmptyItem, DxLabel} from 'devextreme-vue/form';
import {DxScrollView} from 'devextreme-vue/scroll-view';
import notify from 'devextreme/ui/notify';
import DxDateBox from 'devextreme-vue/date-box';
import Vue from 'vue';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import {exportDataGrid} from 'devextreme/excel_exporter';
import DxValidationSummary from 'devextreme-vue/validation-summary';
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: 'Home',
  components: {
    CoreView: () => import('@/views/Constructor/CoreView/CoreView'),
    DxValidationSummary,
    DxDataGrid,
    DxColumn,
    DxToolbar,
    DxLookup,
    DxHeaderFilter,
    DxSearchPanel,
    DxLoadPanel,DxDateBox,
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
    DxScrollView,
    DxScrolling,
    notify,
    DxExport,
    DxSummary,
    DxTotalItem,
    DxSelection,
    DxPaging,
    DxPager, Splitpanes, Pane, DxTabPanel
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
      hideDetailPane: true,
      tabPageDetails: [],
      maxSizePanelGrid: 100,
      selectedTabPanel: {},
      models: [],
      dateNow:new Date(),
      keyModel: 'Id',
      jsonResult: {},
      modelsData: [],
      fieldWhere: '',
      columns: [],
      heighttPanel: window.innerHeight / 1.17,
      loadingVisible: false,
      elementCloseBtn: {
        widget: 'dxButton',
        location: 'after',
        options: {
          icon: 'close',
          type: 'danger',
          hint: 'Закрыть',
          validationGroup: 'DesignerModelEditor',
          onClick: () => this.closeFormEditor()
        }
      },
      isVisibleEditFormDialog: false,
      validateMessageErrorBySave: '',
      toolbarContentDetail: [],
      actionClcik: '',
      modelId: -1,
      propertyItems: [],
      modelSolution: {},
      objParent:null,
      isVisibleEditForm: false,
      captionEditFormModel: '',
      modelDetailId: 0,
      editModel: {},
      keyValue: -1,
      widthDetail: '80%',
      heightDetail: '80%',
      keyEditId: -1,
      isChengeValue: false,
      focusedRowKey: -1,
      multipleMode: 'multiple',
      pageSizes: [25, 50, 100],
      loadPanel: {
        enabled: true,
        height: 90,
        indicatorSrc: "",
        shading: false,
        shadingColor: "",
        showIndicator: true,
        showPane: true,
        text: "Загрузка...",
        width: 200
      },
    }

  },
  computed: {
    dataGrid: function () {
      return this.$refs["dataGrid"].instance;
    },
     dateTimeDialog: function () {
       return this.$refs["dateTimeDialog"].instance;
     },
    tabPanel: function () {
      if (this.selectedTabPanel == null)
        return null;
      return this.$refs["coreView" + this.selectedTabPanel.idModel];
    }
  },
  mounted() {

  },
  methods: {
    onExporting(e) {
      if (this.modelSolution == null)
        return;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet();
      const nameExcel = `${this.modelSolution.text}.xlsx`;

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        autoFilterEnabled: true
      }).then(function () {
        workbook.xlsx.writeBuffer().then(function (buffer) {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), nameExcel);
        });
      });
      e.cancel = true;
    },
    loadButtons: function (modelId) {
      this.$http.post(`/DesignerData/GetButtons`, {formId: modelId}, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.toolbarContent = JSON.parse(JSON.stringify(response.data));
          this.dataGrid.repaint();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadButtonsDetail: function (modelId) {

      this.getDetailInfo(modelId);
      this.$http.post(`/DesignerData/GetButtonsDetail`, {formId: modelId}, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.toolbarContentDetail = JSON.parse(JSON.stringify(response.data));
          let index = 0;
          for (index = 0; index < this.toolbarContentDetail.length; ++index) {
            let element = this.toolbarContentDetail[index];
            element.onClick = () => this.actionDetail(element);
          }
          this.toolbarContentDetail.push(this.elementCloseBtn);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadDataModel: function (model, idModelDetail, fieldWhere, objParent) {
      if (model == null)
        return;
      this.objParent = objParent;
      let modelId = model.idModel;
      if (modelId == -1 || modelId == 0 || modelId == null)
        return;

      if (this.modelId == -1) {
        this.loadButtons(modelId);
        this.loadButtonsDetail(modelId);
      }
      this.modelDetailId = idModelDetail;
      this.fieldWhere = fieldWhere;
      this.modelId = modelId;
      this.modelSolution = model;
      this.loadingVisible = true;
      this.dataGrid.beginCustomLoading();
      this.$http.post(`/DesignerData/GetDataList`, {
        formId: modelId,
        formIdByDetail: idModelDetail,
        fieldWhere: fieldWhere
      }, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.keyModel = response.data.keyField;
          this.columns = JSON.parse(response.data.columns);
          this.models = JSON.parse(response.data.data);
          this.propertyItems = JSON.parse(response.data.formProperty);
          this.widthDetail = `${response.data.formModel.widthDetail}%`;
          this.heightDetail = `${response.data.formModel.heightDetail}%`;
          this.setEventsEditBox(this.propertyItems);
          this.loadingVisible = false;
          this.dataGrid.endCustomLoading();
          if (this.focusedRowKey == -1 && this.models.length > 0) {
            this.focusedRowKey = this.models[0][this.keyModel];
          }
        })
        .catch(function (error) {
          console.log(error);
          notify("Не удалось получить данные", 'error', 10000, 600)
          this.loadingVisible = false;
          this.dataGrid.endCustomLoading();
        });
    },
    setEventsEditBox(e) {
      let index = 0;
      for (index = 0; index < e.length; ++index) {
        let element = e[index];
        if (element.editorOptions != null && element.editorOptions.onValueChanged != null) {
          element.editorOptions.onValueChanged = () => this.valueChandged();
        }
        if (element.items != null)
          this.setEventsEditBox(element.items);
      }
    },
    onToolbarPreparing(e) {
      if (this.toolbarContent == null)
        return;
      for (let index = this.toolbarContent.length - 1; index >= 0; --index) {
        let element = this.toolbarContent[index];
        e.toolbarOptions.items.unshift(element);
        element.onClick = () => this.action(element);
      }
    },
    onFocusedRowChanged(e) {
      this.keyValue = e.row.key;
      this.selectedFieldModelData = e.row.data;
      this.focusedRowKey = this.keyValue;
      if (this.tabPanel != null)
        this.tabPanel.loadDataDetailModel(this.keyValue, this.selectedTabPanel.fieldWhere, this);
    },
    onSelectionChanged(e) {
      console.log(e);
      console.log(this.selectedTabPanel);
      this.selectedTabPanel = e.addedItems[0];
      if (this.tabPanel != null)
        this.tabPanel.loadDataDetailModel(this.keyValue, this.selectedTabPanel.fieldWhere);
    },
    actionDetail(e) {
      if (e.sysName == 'Save')
        this.saveModel();
    },
    action(e) {
      if (e.sysName == 'Add')
        this.add();
      else if (e.sysName == 'Edit')
        this.edit();
      else if (e.sysName == 'Copy')
        this.copy();
      else if (e.sysName == 'Delete')
        this.delete();
      else if (e.sysName == 'Print')
        this.print();
      else if (e.sysName == 'Refresh')
        this.refresh();
      else if (e.sysName.endsWith("Date")) {
        this.actionClcik = e.sysName;
        this.isVisibleEditFormDialog = true;
      } else this.actionSysName(e.sysName);
    },
    actionSysName(sysName, otherInfo) {
      if (this.models.length == 0)
        return;
      if (otherInfo == null) {
        let result = confirm("Вы уверены, что хотите выполнить действие?", "Внимание");
        if (result == false)
          return;
      }

      this.$http.post(`/DesignerData/ActionByModel?sysname=${sysName}&formId=${this.modelId}`, {OtherInfo: otherInfo, Ids: this.getSelectedIds()}, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          notify("Действие успешно выполненно", 'success', 10000, 600);
          console.log(this.objParent);
          if (this.objParent != null)
          {
            this.objParent.refresh();
            this.objParent.focusedRowKey = -1;
          }
          this.refresh();
        })
        .catch(function (error) {
          notify("Не удалось выполнить действие", 'error', 10000, 600)
          console.log(error);
        });
    },
    add() {
      this.validateMessageErrorBySave = '';
      this.keyEditId = 0;
      if (this.modelDetailId != null)
        this.editModel = JSON.parse(`{"${this.keyModel}":0, "${this.fieldWhere}":${this.modelDetailId}}`);
      else this.editModel = JSON.parse(`{"${this.keyModel}":0}`);
      console.log(this.editModel);
      this.captionEditFormModel = `${this.modelSolution.text}. Добавление новой записи`;
      this.isVisibleEditForm = true;

    },
    edit() {
      if (this.models.length == 0)
        return;
      this.validateMessageErrorBySave = '';
      let id = this.keyValue;
      this.keyEditId = id;
      this.$http.post(`/DesignerData/GetEditModel?id=${id}&formId=${this.modelId}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.editModel = JSON.parse(response.data.data);
          this.editModel[`${this.fieldWhere}`] = this.modelDetailId;
          this.captionEditFormModel = `${this.modelSolution.text}. Редактирование записи`;
          this.isVisibleEditForm = true;
        })
        .catch(function (error) {
          notify("Не удалось получить данные", 'error', 10000, 600)
          console.log(error);
        });
    },
    onClickDialog() {
      this.isVisibleEditFormDialog = false;
      console.log(this.dateNow);
      this.actionSysName(this.actionClcik, new Date(this.dateNow));
    }
    ,
    copy() {
      this.validateMessageErrorBySave = '';
      let id = this.keyValue;
      this.keyEditId = id;
      this.$http.post(`/DesignerData/GetEditModel?id=${id}&formId=${this.modelId}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.editModel = JSON.parse(response.data.data);
          Vue.set(this.editModel, this.keyModel, 0);
          if (this.modelDetailId != null)
            this.editModel[this.fieldWhere] = this.modelDetailId;
          this.keyEditId = 0;
          this.captionEditFormModel = `${this.modelSolution.text}. Добавление новой записи`;
          this.isVisibleEditForm = true;
        })
        .catch(function (error) {
          notify("Не удалось получить данные", 'error', 10000, 600)
          console.log(error);
        });
    },
    getSelectedIds() {
      let keyIds = [];
      let index = 0;
      var elements = this.dataGrid.getSelectedRowsData();
      for (index = 0; index < elements.length; ++index) {
        let elementid = elements[index][this.keyModel];
        keyIds.push(elementid);
      }
      if (keyIds.length === 0)
        keyIds.push(this.keyValue);
      return keyIds;
    },
    delete() {
      if (this.models.length == 0)
        return;
      let result = confirm("Вы уверены, что хотите удалить запись?", "Внимание");
      if (result == false)
        return;

      let elements = this.dataGrid.getSelectedRowsData();
      let keyIds = [];
      if (elements.length > 0)
        keyIds = this.getSelectedIds();
      else keyIds = [this.keyValue];

      this.$http.post(`/DesignerData/RemoveEntity?formId=${this.modelId}&typeEditor=1`, keyIds, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then(() => {
          this.isVisibleEditForm = false;
          notify("Данные удалены", 'success', 10000, 600);
          if (elements.length == 0) {
            let indexRow = this.models.indexOf(this.selectedFieldModelData);
            this.models.splice(indexRow, 1);
          } else {
            for (let index = 0; index < elements.length; ++index) {
              let indexRow = this.models.indexOf(elements[index]);
              console.log(indexRow);
              this.models.splice(indexRow, 1);
            }
          }
        })
        .catch(function (error) {
          notify("При удалении данных произошла ошибка", 'error', 10000, 600)
          console.log(error);
        });
    },
    refresh() {
      this.loadDataModel(this.modelSolution, this.modelDetailId, this.fieldWhere);
    },
    async getDetailInfo(formId) {
      await this.$http.post(`/DesignerData/GetDetailInfoModels?formId=${formId}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.tabPageDetails = response.data;
          this.hideDetailPane = this.tabPageDetails.length === 0;
          if (this.tabPageDetails.length === 0)
            this.maxSizePanelGrid = 60;
          else this.selectedTabPanel = this.tabPageDetails[0];
        })
        .catch(function (error) {
          notify("Получение данных деталей", 'error', 10000, 600)
          console.log(error);
        });
    },
    async afterSaveModel() {
      this.$http.post(`/DesignerData/AfterSaveModel?formId=${this.modelId}&idModel=${this.keyEditId}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.isVisibleEditForm = false;
        })
        .catch(function (error) {
          notify("После сохранения данных произошла ошибка", 'error', 10000, 600)
          console.log(error);
        });
    },

    async saveModel(e) {
      let resValidate = await this.validateRule();
      if (resValidate === false) {
        notify(this.validateMessageErrorBySave, 'error', 10000, 600)
        return;
      }

      this.$http.post(`/DesignerData/SaveModel?formId=${this.modelId}&typeEditor=1`, this.editModel, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          this.afterSaveModel();
          notify("Данные успешно сохранены", 'success', 10000, 600)
          if (this.keyEditId == 0) {
            this.models.push(JSON.parse(response.data.result));
          } else {
            let indexRow = this.dataGrid.getRowIndexByKey(this.keyEditId);
            Vue.set(this.models, indexRow, JSON.parse(response.data.result));
          }
        })
        .catch(function (error) {
          notify("При сохранении данных произошла ошибка", 'error', 10000, 600)
          console.log(error);
        });
    },
    closeFormEditor() {
      if (this.isChengeValue == true) {
        let result = confirm("Данные на форме поменялись. Все равно выйти?", "Внимание");
        if (result == false)
          return;
      }
      this.isVisibleEditForm = false;
      this.editModel = {};
    },
    onInitialized: function (e) {
      this.isChengeValue = false;
    },
    valueChandged() {
      this.isChengeValue = true;
    },
    async validateRule() {
      this.validateMessageErrorBySave = '';
      await this.$http.post(`/DesignerData/ValidateRuleEntity?formId=${this.modelId}`, this.editModel, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then((response) => {
          if (response.data.errors.length > 0)
            this.validateMessageErrorBySave = response.data.errors[0].description;
        })
        .catch(function (error) {
          console.log(error);
        });
      return this.validateMessageErrorBySave == '';
    }
  }
}
