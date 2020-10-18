import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import DxTabPanel from 'devextreme-vue/tab-panel';
import DxButton from 'devextreme-vue/button'
import {
  DxGroupItem, DxItem, DxForm,
  DxSimpleItem,
  DxButtonItem,
  DxLabel,
  DxRequiredRule,
  DxEmptyItem
} from 'devextreme-vue/form';
//import FormsGrid from '@/components/Settings/Grids/formsGrid/formsGrid';
//import DxTabs from 'devextreme-vue/tabs';
export default {
  name: 'Home',
  components: {
    Splitpanes,
    Pane,
    DxButton,
    DxTabPanel,
    DxItem,
    Orgs: () => import('@/components/Settings/Orgs/orgs'),
    Roles: () => import('@/components/Settings/Users/RolesList/RolesGrid'),
    Users: () => import('@/components/Settings/Grids/UsersGrid/UsersGrid'),
    Forms: () => import('@/components/Settings/Forms/forms'),
    Fields:()=> import('@/components/Settings/Fields/fields'),
    Buttons: () => import('@/components/Settings/Buttons/buttons'),
  },
  data() {
    return {
      org: {},
      role: {},
      usersData: [],
      selectedIndex: 0,
      isShowForms: true,
      isShowBtns: true,
      height: window.innerHeight / 1.12,
    }
  },
  methods: {
    OnClickOrg(e) {
      this.org = e
      this.role = {}
      this.$refs["rolesGrid"].refresh(this.org)
      
    },
    onActionOrg() {
      this.$refs.orgsGrid.roles = []
      this.org = {}
      this.role = {}
      this.clearLists()
    },
    titleClick() {
      if (this.role.id != undefined) {
        if (this.selectedIndex === 0)
        this.$refs["users"].initialize(this.role.id)
        if (this.selectedIndex === 1)
          this.$refs["btns"].initialize(this.role.id)
        if (this.selectedIndex === 2)
          this.$refs["forms"].initialize(this.role.id)
        if (this.selectedIndex === 3)
          this.$refs["fields"].initialize(this.role.id)
        this.$refs.users.user = {}
      }
    },
    OnClickRole(e) {
      this.role = e
      if (this.selectedIndex === 0)
      this.$refs["users"].initialize(this.role.id)
      if (this.selectedIndex === 1)
        this.$refs["btns"].initialize(this.role.id)
      if (this.selectedIndex === 2)
        this.$refs["forms"].initialize(this.role.id)
      if (this.selectedIndex === 3)
        this.$refs["fields"].initialize(this.role.id)
      this.$refs.users.user = {}
    },
    onActionRole() {
      this.$refs["rolesGrid"].refresh(this.org)
      this.role = {}
      this.clearLists()
    },
    clearLists() {
      this.$refs.fields.fields = []
      this.$refs.forms.forms = []
      this.$refs.btns.btns = []
      this.$refs.users.users = []
      this.$refs.users.user = {}
    }
  },
  mounted() {
  },
  computed: {
   
  }
}
