import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import DxTreeView from 'devextreme-vue/tree-view';
import {DxTabPanel} from 'devextreme-vue/tab-panel';
import {  DxItem } from 'devextreme-vue/form';
import { DxSortable } from 'devextreme-vue';
import HomeIcon from "@/assets/home.svg";

export default {
  name: 'Home',
  components: {
    CoreView: () => import('@/views/Constructor/CoreView/CoreView'),
    Users: () => import('@/components/Users/Users'),
    Splitpanes, Pane,
    DxTreeView,DxTabPanel,DxItem,DxSortable
  },
  data() {
    return {
      heightTree:window.innerHeight /1.12,
      widthtLeftPanel:500,
      widthtRigthPanel:innerWidth - 500,
      menus: [],
      searchMode: 'contains',
      tabPages:[],
      selectedTabPanel:{}
    }

  },
  mounted(){
    this.loadSolution();
  },
  methods: {
    closeButtonHandler(itemData) {
      if(!itemData) return;
      this.tabPages.splice(this.tabPages.indexOf(itemData),1);
      this.selectedTabPanel = {};
    },
    selectItemMenu: function(e)
    {
      if (e.itemData.tableName == '' || e.itemData.tableName == null)
        return;
      let page = this.tabPages.find(p => p.id == e.itemData.id);
      if (page == null)
        {
          page = e.itemData;
          this.tabPages.push(page);
        }
      this.selectedTabPanel = page;
    },
    loadSolution: function()
    {
      this.$http.post(`/DesignerData/GetSolutionModel`, '' , {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('accessToken')}`
        }})
      .then((response) => {
            this.menus = response.data;
            this.tabPages.push(this.menus[0]);
            this.selectedTabPanel = this.menus[0];
          })
      .catch(function (error) {
            console.log(error);
          });
    }
  }
}
