import DxDateBox from 'devextreme-vue/date-box';
import { DxButton } from 'devextreme-vue/button';
import {
  DxDataGrid, DxColumn, DxFormat, DxLookup, DxHeaderFilter, DxSearchPanel, DxFilterRow, DxScrolling, DxExport,
  DxSummary, DxTotalItem, DxSelection, DxPaging, DxPager, DxColumnFixing,
} from 'devextreme-vue/data-grid';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { DxSwitch } from 'devextreme-vue/switch';
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxDateBox, DxButton,
    DxDataGrid, DxColumn,  DxFormat, DxLookup, DxHeaderFilter, DxSearchPanel, DxFilterRow, DxScrolling, DxExport,
    DxSummary, DxTotalItem, DxSelection, DxPaging, DxPager, DxColumnFixing,
    DxLoadPanel, DxSwitch, DxCheckBox
  },
  data() {
    return {
      datevalue: null,
      focusedRowKey: -1,
      keyValue: -1,
      isDisabledButton: true,
      loadingVisible: false,
      loadingPosition: { of: '#gridContainer' },
      keyModel: 'sysid',
      models: [],
      errors: [],
      pageSizes: [25, 50, 100, 250], 
      multipleMode: 'multiple',
      selectedRowKeys: [],
      selectedFieldModelData: [],
      loadeddocscount:0,
      switchValue: false,
      // disabledDates: getHolidays()
    };
  },
  mounted(){
    let today = new Date();
    this.datevalue = new Date(today.getFullYear(),today.getMonth(),today.getDate());
    this.datevalue.setHours(0,0,0,0);
    this.getPpsData(this.datevalue);
  },
  computed: {
    switchValueInverted: {
      get: function () {
        return !this.switchValue;
      },
    }
  },
  methods: {
    getPpsData(datechosed) {
      console.log(datechosed);
       this.loadeddocscount=0;
      this.errors = null;
      this.loadingVisible = true ;
      this.$http.post(`/Pp/GetPpsData`, { year: datechosed.getFullYear(), month: datechosed.getMonth()+1, day: datechosed.getDate()}, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
        .then(response => {
          //console.log(response);
          let responsedata = response.data;
          this.errors = responsedata.errors
          this.models = responsedata.succeeded ? responsedata?.result : null;
          this.loadingVisible = false;
        })
        .catch(error => {
          console.log(error);
          this.loadingVisible = false;
        });
    },
    onSelectionChanged(e) {
      this.loadeddocscount=0;
      this.selectedRowKeys = e.selectedRowKeys;
      this.selectedFieldModelData =e.selectedFieldModelData;
      this.isDisabledButton = this.selectedRowKeys.length<=0;
      if(this.selectedRowKeys.length==0 && this.switchValue){
        this.switchValue = false;
        this.switchValueChanged(false);
      }
    }, 
    onExporting(e) {
       return;
    },
    makePp() {
      this.loadeddocscount=0;
      this.errors = null;
      this.loadingVisible = true ;
      let ipp=0;
      for (ipp = 0; ipp < this.selectedRowKeys.length; ipp++) {
        let keyid = this.selectedRowKeys[ipp];
        console.log(`Make for Key: ${keyid}`);
        this.$http.post(`/Pp/MakePp`, {idpp: keyid}, {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
          .then(response => {
            //console.log(`RESPONSE ${ipp}`);
            //console.log(response);
            let responsedata = response.data;
            this.errors = responsedata.errors
            let makeResult = responsedata.succeeded ? responsedata?.result[1] : null;
            let fn = responsedata.succeeded ? responsedata?.result[0] ?? "" : "";
            if(responsedata.errors.length == 0)
            {
              const arrayBuffer = this.base64ToArrayBuffer(makeResult);
              this.createAndDownloadBlobFile(arrayBuffer, `ПП ${fn}`);
              this.loadeddocscount++;
            }
            this.loadingVisible = false;
          })
          .catch(error => {
            console.log(error);
            this.loadingVisible = false;
          });
      }
    },
    createAndDownloadBlobFile(body, filename, extension = 'docx') {
      //https://medium.com/@riccardopolacci/download-file-in-javascript-from-bytea-6a0c5bb3bbdb
      const blob = new Blob([body]);
      const fileName = `${filename}.${extension}`;
      if (navigator.msSaveBlob) {
        // IE 10+
        console.log("Файл сохранен.");
        navigator.msSaveBlob(blob, fileName);
      } else {       
        const link = document.createElement('a');              
        // Browsers that support HTML5 download attribute
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute("type", blob.type);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          let wnd = null;
          console.log(navigator.appVersion);
          //if(!document.documentMode && window.msWriteProfilerMark)
          if(navigator.appVersion.indexOf("Chrome") != -1 && navigator.appVersion.indexOf("Edg"))
             wnd = window.open(link); // Microsoft Edge
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log("Файл загружен.");
          if(wnd!=null)
             wnd.close(); 
        } else {
          console.log("Загрузка невозможна.");
          return;
        }
        let url = "";
        window.open(url);
      }
    },
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64); // Comment this if not using base64
      const bytes = new Uint8Array(binaryString.length);
      return bytes.map((byte, i) => binaryString.charCodeAt(i));
    },
    switchValueChanged(value){
       //console.log("SWITH:");
       //console.log(value);
       const dataGrid = this.$refs.dataGridRefName.instance;

       if (!value) {
         dataGrid.clearFilter();
       }
       else {
         var filter = [];  
         for (var i = 0; i < this.selectedRowKeys.length; i++) {  
            filter.push(["sysid", "=", parseInt(this.selectedRowKeys[i])]);  
            filter.push("or");  
         }  
         filter.pop();  
         dataGrid.filter(filter);
       }  
    }      
  }
};