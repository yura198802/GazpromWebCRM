import DxChart, {
  DxArgumentAxis,
  DxLegend,
  DxLabel,
  DxSeriesTemplate,
  DxCommonSeriesSettings,
  DxSeries
} from 'devextreme-vue/chart';
import DxPieChart, {
  DxSize,
  DxConnector,
  DxExport
} from 'devextreme-vue/pie-chart';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';

export default {
  name: 'Home',
  components:{
    DxSeriesTemplate,
    DxSeries,
    DxSize,
    DxExport,
    DxConnector,
    DxPieChart,
    DxChart,
    DxArgumentAxis,
    DxLabel,
    DxLegend,
    DxCommonSeriesSettings,
    DxToolbar,
    DxItem
  },
  data(){
    return{
      purchases:[],
      visiblePie:true,
      options: {
        icon: 'menu',
        hint: "Принять",
        text: "",
        type: "normal",
        stylingMode:"outlined",
        onClick: () => this.hideManager()
      },
      styleObject: {
        display: 'none'
      },
      stylePie: {
        display: 'inline',
      }
    }
  },
  methods: {
    hideManager(){
      this.visiblePie =!this.visiblePie
      if(this.visiblePie){
         this.styleObject.display = "none"
        this.stylePie.display = "inline"
      }
      else{
       this.styleObject.display = "inline"
        this.stylePie.display = "none"
      }
    },
    customizeLabelText( arg ) {
      return `${arg.value}`;
    },
    async getPurchases(n) {
      const vm = this
      await this.$http.post(`/Transaction/GetCosts?id=${n}`, {},
         {
           headers: {
             Authorization: `Bearer ${vm.$cookie.get('accessToken')}`,
           }
         })
         .then(function (response) {
           vm.purchases = response.data;

         })
         .catch(function (error) {
           console.log(error);
           vm.purchases =[]
         });
    }
  },
  mounted:async function(){
    this.getPurchases()
  }
}
