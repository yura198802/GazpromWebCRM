export default {
  name: 'Main',
  components: {
    Header: () => import('./Header/Header'),
    Sidebar: () => import('./Sidebar/Sidebar')
  },
}
