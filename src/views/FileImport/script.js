import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxButton } from 'devextreme-vue/button';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { DxLoadPanel } from 'devextreme-vue/load-panel';

export default {
  components: {
    DxFileUploader,
    DxCheckBox,
    DxSelectBox,
    DxButton,
    DxNumberBox,
    DxLoadPanel
  },
  data(){
    return {
      loadingVisible: false,
      loadingPosition: { of: '#preview' },
      daysShift: 1,
      daysshiftmodel:1,
      accept: '*.*',
      fileTypesSource: [
        { name: 'Все типы', value: '*.*' },
        { name: 'Файлы BD - Информация из расчетных документов', value: '.BD*' },
        { name: 'Файлы VT - Выписка из лицевого счета администратора доходов бюджета', value: '.VT*' },
        { name: 'Файлы ZF - Запрос на выяснение принадлежности платежа', value: '.ZF*' },
        { name: 'Файлы IP - Сводная ведомость по кассовым поступлениям', value: '.IP*' },
        { name: 'Файлы NP - Сведения о поступивших от юридических лиц платежах', value: '.NP*' },
        { name: 'Файлы SF - Справка органа Федерального казначейства', value: '.SF*' },
        { name: 'Файлы SE - Справка о кассовых операциях со средствами бюджета', value: '.SE*' },
        { name: 'Файлы CE - Ведомость кассовых поступлений в бюджет', value: '.CE*' },
        { name: 'Файлы XLSX - Выписка МФ', value: '.XLSX' }
      ],
      file: '',
      infoPreview:[],
      infoImport:[],
      errorsPreview:[],
      errorsImport:[],
      isDisabledImport:true,
    }
    
  },
  mounted(){
    this.defaultPreview()
  },
  methods: {
    handleFileUpload(e){
      this.loadingPosition = { of: '#fileuploader' }
      this.loadingVisible = true;
      this.defaultPreview();
      this.file = e.value[0];
      this.previewFile();
    },
    defaultPreview()
    {
      this.errorsPreview = null;
      this.errorsImport = null;
      this.infoPreview = ["Файл не выбран !"];
      this.infoImport = null;
      this.isDisabledImport = true;
    },
    previewFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      this.$http.post(`/Import/FilePreview`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then(response => {
          let responsedata = response.data;
          this.errorsPreview = responsedata.errors;
          this.infoPreview = responsedata.succeeded ? responsedata?.result?.infoLines : null;
          this.loadingVisible = false;
          this.isDisabledImport = !responsedata.succeeded
        })
        .catch(error => {
          this.loadingVisible = false;
          this.isDisabledImport = true;   
        });
    },
    importFile() {
      this.loadingPosition = { of: '#import' }
      this.loadingVisible = true;
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('daysShift', this.daysShift);
      this.$http.post(`/Import/FileImport`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then(response => {
          let responsedata = response.data;
          this.errorsImport = responsedata.errors
          this.infoImport = responsedata.succeeded ? responsedata?.result?.infoLines : null;
          this.loadingVisible = false;
        })
        .catch(error => {
          console.log(error);
          this.loadingVisible = false;
        });
    },
  }
};