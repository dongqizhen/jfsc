interface StateType {
    isLogin:Boolean,
    userInfo:Object,
    userShopInfo: Object,
    currentCityIp:Object
}
 let state:StateType={
    isLogin:false,
    userInfo:{

    },
     userShopInfo:{},
     currentCityIp:{}
}

export default state;