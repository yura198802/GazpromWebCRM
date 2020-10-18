import { Multipane, MultipaneResizer } from 'vue-multipane';
import { DxDataGrid, DxColumn,DxLookup,  DxHeaderFilter,  DxSearchPanel,  DxFilterRow } from 'devextreme-vue/data-grid';
import { DxToolbar,DxPopup,DxButton} from 'devextreme-vue';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import DxValidationGroup from 'devextreme-vue/validation-group';
import {   DxForm,  DxSimpleItem,  DxButtonItem,  DxRequiredRule,DxEmptyItem,  DxLabel} from 'devextreme-vue/form';
import DxSelectBox from 'devextreme-vue/select-box';
import DxNumberBox from 'devextreme-vue/number-box';

export default {
  components: { DxDataGrid, DxColumn,DxToolbar,DxLookup,
    DxHeaderFilter,Multipane, MultipaneResizer,
    DxSearchPanel,DxLoadPanel,DxNumberBox,
    DxFilterRow,DxPopup,DxForm,DxSimpleItem,DxLabel,DxButtonItem,DxValidationGroup,DxButton,DxRequiredRule,DxEmptyItem,DxSelectBox },
  data() {
    return {
      heightTree:window.innerHeight /1.12,
      widthtLeftPanel:innerWidth - 500,
      bots: [],  
      selectedBot:{myCBuyIn:0},
      visibleFormStats:false,
      loadingVisible:false,
      toolbarContentBot: [
      {
        widget: 'dxButton',
        location: 'before',
        hint:'Добавление нового бота',
        options: {
          icon: 'add',
          onClick: () => this.addBot()
        }
      },
      {
        widget: 'dxButton',
        location: 'before',
        hint:'Редактирование бота',
        options: {
          icon: 'edit',
          onClick: () => this.editBot()
        }
      },
      {
        widget: 'dxButton',
        location: 'before',
        hint:'Удалить бота',
        options: {
          icon: 'remove',
          onClick: () => this.deleteBot()
        }
      },
      {
        widget: 'dxButton',
        location: 'after',
        hint:'Обновить данные о ботах',
        options: {
          icon: 'refresh',
          onClick: () => this.getAllBots()
        }
      }]
      
      } 
  },
  mounted(){  
    this.getAllBots();
  },
  methods:{
    onToolbarPreparing(e) {
      for (let index = this.toolbarContent.length-1; index >=0 ; --index) 
          {
            let element = this.toolbarContent[index];
            e.toolbarOptions.items.unshift(element);
          }
    },
    getAllBots: function()
    {
      this.loadingVisible = true;
      this.bots = [];
        this.$http.post('/ReaderTourney/GetAllBots', '', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('accessToken')}`
          }
        })
        .then((response) => {
          this.bots = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
        this.loadingVisible = false;
    },
    getStatsOverview: function (idBot) {
      this.loadingVisible = true;
      this.$http.post(`/ReaderTourney/GetStatsOverview?idBot=${idBot}`, '', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }
      })
      .then((response) => {
        this.selectedBot = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
      this.loadingVisible = false;
    },
    selectionPlayer: function(e)
    {
      if (e.selectedItem == null)
        {
          this.visibleFormStats = false;
          return;
        }
      this.getStatsOverview(e.selectedItem.id);
      this.visibleFormStats = true;
    },
    addBot: function()
    {

    },
    editBot:function()
    {

    },
    deleteBot:function()
    {

    }
  }
}