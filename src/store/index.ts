import Vuex from 'vuex'
import Vue from "vue";
import state from './state'
import actions from './actions'
import mutations from './mutations'

import createVuexAlong from 'vuex-along'
//  import createPersistedState from 'vuex-persistedstate'
//console.log(createVuexAlong)
// const plugins = [createPersistedState({
//     key: "vuex-along" 
// })] 

// const plugins=[createVuexAlong({
//     name:'vuex-along'
// })]

//console.log(plugins)

Vue.use(Vuex);

console.log(state)

export default new Vuex.Store({
    state,
    actions,
    mutations,
     plugins: [createVuexAlong({
         name: "vuex-along" // 设置保存的集合名字，避免同站点下的多项目数据冲突        
     })]
    //plugins
})
