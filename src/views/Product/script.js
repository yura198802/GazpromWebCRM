import {
  DxDataGrid, DxColumn, DxLookup, DxHeaderFilter, DxSearchPanel, DxFilterRow, DxScrolling, DxExport,
  DxSummary, DxTotalItem, DxSelection, DxPaging, DxPager
} from 'devextreme-vue/data-grid';
import {DxToolbar, DxPopup, DxButton} from 'devextreme-vue';
import {DxTabPanel} from 'devextreme-vue/tab-panel';
import {DxLoadPanel} from 'devextreme-vue/load-panel';
import DxValidationGroup from 'devextreme-vue/validation-group';
import {DxForm, DxSimpleItem, DxButtonItem, DxRequiredRule, DxEmptyItem, DxLabel} from 'devextreme-vue/form';
import DxValidationSummary from "devextreme-vue/validation-summary";
import {DxScrollView} from "devextreme-vue/scroll-view";
import notify from "devextreme/ui/notify";

export default {
  components: {
    DxValidationSummary, DxDataGrid, DxColumn, DxToolbar,DxLookup,DxHeaderFilter,DxSearchPanel,DxLoadPanel,DxFilterRow,DxPopup,DxForm,DxSimpleItem,DxLabel,
    DxButtonItem, DxValidationGroup,DxButton,DxRequiredRule,DxEmptyItem,DxScrollView,DxScrolling,notify,DxExport,DxSummary,DxTotalItem,DxSelection,DxPaging,
    DxPager, DxTabPanel
  },
  data() {
    return {
      focusedRowKey:-1,
      productsData:[],
      loadPanel: {
        enabled:true,
        height:90,
        indicatorSrc:"",
        shading:false,
        shadingColor:"",
        showIndicator:true,
        showPane:true,
        text:"Загрузка...",
        width:200
      },

    };
  },
  mounted(){
  },
  methods:{

  }
}
