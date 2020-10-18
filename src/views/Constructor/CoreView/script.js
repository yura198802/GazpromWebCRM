import MainView from '../MainView/MainView.vue';
import DesignerDictionary from '../DesignerDictionary/DesignerDictionary.vue';
import FileImport from  '../../FileImport/FileImport.vue'
import Pp from  '../../Pp/Pp.vue'
import Product from  '../../Product/Product.vue'
import Client from  '../../Product/Client/Client.vue'
import diag from  '../../../components/Diag/diag.vue'

export default {
  components: {
    Users: () => import('@/components/Users/Users'),
    MainView,
    DesignerDictionary,
    FileImport, Pp,
    Settings:()=>import("@/views/Settings/settings"),
    Client,
    Product,
    diag
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
      contentTemplate: this.templateData.vueComponent
    }
  },
  mounted() {
    console.log(this.templateData.vueComponent);
    if (this.templateData.vueComponent === "DesignerDictionary" && this.templateData.fieldWhere === null) {
      this.contentTemplate = this.templateData.vueComponent;
      this.$refs.componentModel.loadDataModel(this.templateData);
    }

  },
  methods: {
    loadDataDetailModel: function (idModel, fieldWhere, obj) {
      if (this.templateData.vueComponent == "DesignerDictionary") {
        this.$refs.componentModel.loadDataModel(this.templateData,idModel,fieldWhere,obj);
      }
      if (this.templateData.vueComponent == "diag" )
      {
        this.$refs.componentModel.getPurchases(idModel);
      }
    }

  }
}
