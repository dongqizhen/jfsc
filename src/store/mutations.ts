const mutations = {
    changeLoginState(state:any,val:Boolean){
        state.isLogin = val
    },
    changeUserInfoState(state:any,val:Object){
        state.userInfo = val
    },
    changeUserShopInfoState(state: any, val: Object){
        state.userShopInfo = val;
    },
    changeCurrentCityIp(state: any, val: Object){
        state.currentCityIp = val;
    }
}

export default mutations;