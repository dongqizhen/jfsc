import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
console.log(process.env)
const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/",
            name: "首页",
            component: () =>
                import ( /* webpackChunkName: "index" */ "../views/index")
        },
        {
            path: "/merchant",
            meta: {
                requireAuth: true
            },
            component: () =>
                import ("../views/page/merchant/merchant"),
            children: [{
                    path: "/",
                    name: '默认',
                },
                {
                    path: "openShop",
                    name: '我要开店',
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-我要开店-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/openShop")
                }, {
                    name: '店铺首页',
                    path: "shopIndex",
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/shopIndex")
                },
                {
                    path: "shopInfo",
                    name: "店铺信息",
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/shopInfo")
                },
                {
                    path: "shopCertification",
                    name: "店铺认证",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-店铺认证-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/shopCertification")
                },
                {
                    path: "publishGoods",
                    name: "发布商品",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-发布商品-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/publishGoods")
                },
                {
                    path: "productManage",
                    name: "产品管理",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-产品管理-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/productManage")
                },
                {
                    path: "inquiryManage",
                    name: "询价管理",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-询价管理-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/inquiryManage")
                },
                {
                    path: "inquiryOrderDetail/:id",
                    name: "询价单详情",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-询价单详情-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/inquiryDetail")
                },
                {
                    path: "editInquiry/:id",
                    name: "编辑询价单",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-编辑询价单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/editInquiry")
                },
                {
                    path: "orderManage",
                    name: "订单管理",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-订单管理-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/orderManage")
                },
                {
                    path: "orderDetail/:id",
                    name: "订单详情",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-订单详情-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/orderDetail")
                },
                {
                    path: "accountSecurity",
                    name: "账户安全",
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-账户安全-积分商城'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/accountSecurity")
                },
                {
                    path: "personalCenter",
                    name: "个人中心",
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/personalCenter")
                },
                {
                    path: "messageCenter",
                    name: "信息中心",
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/messageCenter")
                },
                {
                    path: "messageDetail/:id",
                    name: '信息详情',
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/messageDetail")
                }, {
                    path: 'contactBuyer',
                    name: '联系买家',
                    meta: {
                        role: 'Administrator',
                        title: '商家中心-联系买家-积分商城'
                    },
                    component: () =>
                        import ('../views/page/merchant/merchantChildren/messageCenterChildren/contactBuyer')
                }, {
                    path: "changePassword",
                    name: '更改密码',
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/changePassword")
                }, {
                    path: "changePhone",
                    name: '更改手机号',
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/changePhone")
                }, {
                    path: "changeEmail",
                    name: '更改邮箱',
                    meta: {
                        role: 'Administrator'
                    },
                    component: () =>
                        import ("../views/page/merchant/merchantChildren/changeEmail")
                }
            ]
        },
        {
            name: '详情',
            path: '/details',
            component: () =>
                import ('../views/page/shop/details'),
            children: [{
                path: 'videoDetails',
                name: '视频详情',
                component: () =>
                    import ('../views/page/shop/detailsChildren/videoDetails')
            }, {
                path: 'caseDetails',
                name: '案例详情',
                component: () =>
                    import ('../views/page/shop/detailsChildren/caseDetails')
            }, {
                path: 'articleDetails',
                name: '文章详情',
                component: () =>
                    import ('../views/page/shop/detailsChildren/articleDetails')
            }, {
                path: 'productDetails/:id',
                name: '产品详情',
                meta: {
                    //title: '产品详情'
                },
                component: () =>
                    import ('../views/page/shop/detailsChildren/productDetails')
            }, {
                path: 'bidInfoDetails',
                name: '中标信息详情',
                component: () =>
                    import ('../views/page/shop/detailsChildren/bidInfoDetails')
            }]
        }, {
            name: "搜索",
            path: "/search",
            component: () =>
                import ('../views/page/shop/search.vue')
        }, {
            name: '找店铺',
            path: '/lookingShop',
            meta: {
                title: '找医疗器械店铺-积分商城'
            },
            component: () =>
                import ('../views/page/shop/lookingShop.vue')
        }, {
            name: '店铺详情',
            path: '/shopDetails',
            component: () =>
                import ('../views/page/shop/shopDetails')
        }, {
            path: '/lookingProduct',
            component: () =>
                import ('../views/page/shop/lookingProduct'),
            children: [{
                name: '产品分类',
                path: '/',
                meta: {
                    title: '找医疗器械产品-积分商城'
                },
                component: () =>
                    import ('../views/page/shop/lookingProductChildren/brandClassific')
            }, {
                name: '产品分类主页',
                path: 'oneOfBrandClassificne',
                meta: {
                    title: '找医疗器械品牌-积分商城'
                },
                component: () =>
                    import ('../views/page/shop/lookingProductChildren/oneOfBrandClassific')
            }, {
                name: '品牌主页',
                path: 'brand',
                // meta: {
                //     title: '找医疗器械品牌-积分商城'
                // },
                component: () =>
                    import ('../views/page/shop/lookingProductChildren/brand')
            }, {
                name: '型号主页',
                path: 'model',
                // meta: {
                //     title: '找医疗器械产品-积分商城'
                // },
                component: () =>
                    import ('../views/page/shop/lookingProductChildren/model')
            }]
        }, {
            name: '关于我们',
            path: '/aboutUs',
            meta: {
                title: '关于我们-积分商城'
            },
            component: () =>
                import ('../views/page/shop/aboutUs')
        }, {
            name: '参数对比',
            path: '/comparisonOfParameters',
            component: () =>
                import ('../views/page/shop/comparisonOfParameters')
        }, {
            name: '店铺介绍',
            path: '/shopIntroduction',
            component: () =>
                import ('../views/page/shop/shopIntroduction')
        }, {
            path: '/login',
            component: () =>
                import ('../views/page/login/login'),
            children: [{
                name: '登录',
                path: '/',
                meta: {
                    title: '用户登录-积分商城'
                },
                component: () =>
                    import ('../views/page/login/loginChildren/loginUp')
            }, {
                name: '注册',
                path: '/register',
                meta: {
                    title: '用户注册-积分商城'
                },
                component: () =>
                    import ('../views/page/login/loginChildren/register')
            }, {
                name: '忘记密码',
                path: '/forgetPassword',
                meta: {
                    title: '忘记密码-用户中心-积分商城'
                },
                component: () =>
                    import ('../views/page/login/loginChildren/forgetPassword')
            }]
        }, {
            name: '服务协议',
            path: '/register/agreement',
            component: () =>
                import ('../views/page/login/agreement')
        }, {
            path: '/userCenter',
            meta: {
                role: 'Administrator'
            },
            component: () =>
                import ('../views/page/shop/userCenter'),

            children: [{
                    path: "/",
                    name: '选购单',
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-选购单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/purchaseOrder")
                },
                {
                    path: "myInquiry",
                    name: "我的询价",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-我的询价-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myInquiry")
                },
                {
                    path: "inquiryOrderDetail/:id",
                    name: "询价单",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-询价单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/inquiryOrderDetail")
                },
                {
                    path: "submitOrder/:id",
                    name: "提交订单",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-提交订单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/submitOrder")
                },
                {
                    path: "myOrder",
                    name: "我的订单",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-我的订单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myOrder")
                },
                {
                    path: "orderDetail/:id",
                    name: "我的订单详情",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-我的订单详情-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/orderDetails")
                },
                {
                    path: "comment/:id",
                    name: "评价",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-评价-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/comment")
                },
                {
                    path: "myQuote",
                    name: "我的报价",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-我的报价-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myQuote")
                },
                {
                    path: "lookQuote/:id",
                    name: "查看报价单",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-查看报价单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/lookQuote")
                },
                {
                    path: "editQuote/:id",
                    name: "编辑报价单",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-编辑报价单-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/editQuote")
                },
                {
                    path: "myStore",
                    name: "我的收藏",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-我的收藏-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myStore")
                },
                {
                    path: "addressManage",
                    name: "地址管理",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-地址管理-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/addressManage")
                },
                {
                    path: "invoiceManage",
                    name: "发票管理",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-发票管理-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/invoiceManage")
                },
                {
                    path: "myMessage",

                    meta: {
                        role: 'Administrator',
                        title: '个人中心'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myMessage"),
                    children: [{
                        path: '/',
                        name: "我的消息中心",
                        meta: {
                            role: 'Administrator',
                            title: '个人中心-我的消息中心-积分商城'
                        },
                        component: () =>
                            import ('../views/page/shop/userCenterChildren/myMessageChildren/message')
                    }, {
                        path: 'contactService',
                        name: '联系客服',
                        meta: {
                            role: 'Administrator',
                            title: '个人中心-联系客服-积分商城'
                        },
                        component: () =>
                            import ('../views/page/shop/userCenterChildren/myMessageChildren/contactService')
                    }]
                },
                {
                    path: "myCenter",
                    name: "个人信息",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-个人信息-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/myCenter"),
                },
                {
                    path: "userSecurity",
                    name: "账号安全",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-账号安全-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/accountSecurity")
                },
                {
                    path: "messageDetail/:id",
                    name: '消息详情',
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-消息详情-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/messageDetails")
                }, {
                    path: "changePassword",
                    name: '修改密码',
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-修改密码-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/changePassword")
                }, {
                    path: "changePhone",
                    name: '修改手机号',
                    meta: {
                        role: 'Administrator',
                        title: '个人中心-修改手机号-积分商城'
                    },
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/changePhone")
                }, {
                    path: "changeEmail",
                    meta: {
                        role: 'Administrator',
                        title: '个人中心'
                    },
                    name: '个人中心-修改邮箱-积分商城',
                    component: () =>
                        import ("../views/page/shop/userCenterChildren/changeEmail")
                }
            ]
        }, {
            name: "底部tab",
            path: '/footer/guide',
            component: () =>
                import ('../views/page/guide/guide'),
            children: [{
                    name: "底部的关于我们",
                    path: "aboutUs",
                    component: () =>
                        import ("../views/page/guide/guideChildren/aboutUs.vue")
                },
                {
                    name: "如何注册",
                    path: "howToRegister",
                    component: () =>
                        import ("../views/page/guide/guideChildren/howToRegister.vue")
                },
                {
                    name: "卖家入门",
                    path: "sellerEntry",
                    component: () =>
                        import ("../views/page/guide/guideChildren/sellerEntry.vue")
                },
                {
                    name: "买家入门",
                    path: "buyerEntry",
                    component: () =>
                        import ("../views/page/guide/guideChildren/buyerEntry.vue")
                },
                {
                    name: "询价系统",
                    path: "inquirySystem",
                    component: () =>
                        import ("../views/page/guide/guideChildren/inquirySystem.vue")
                },
                {
                    name: "快速下单",
                    path: "quickOrder",
                    component: () =>
                        import ("../views/page/guide/guideChildren/quickOrder.vue")
                },
                {
                    name: "如何采购",
                    path: "howToPurchase",
                    component: () =>
                        import ("../views/page/guide/guideChildren/howToPurchase.vue")
                },
                {
                    name: "投诉维权",
                    path: "complaints",
                    component: () =>
                        import ("../views/page/guide/guideChildren/complaints.vue")
                },
                {
                    name: "开通店铺",
                    path: "howToOpenShop",
                    component: () =>
                        import ("../views/page/guide/guideChildren/howToOpenShop.vue")
                },
                {
                    name: "营销中心",
                    path: "marketingCenter",
                    component: () =>
                        import ("../views/page/guide/guideChildren/marketingCenter.vue")
                },
                {
                    name: "发布新品",
                    path: "releaseNewProducts",
                    component: () =>
                        import ("../views/page/guide/guideChildren/releaseNewProducts.vue")
                },
                {
                    name: "商家服务",
                    path: "merchantService",
                    component: () =>
                        import ("../views/page/guide/guideChildren/merchantService.vue")
                },
                {
                    name: "支付方式",
                    path: "paymentMethod",
                    component: () =>
                        import ("../views/page/guide/guideChildren/paymentMethod.vue")
                },
                {
                    name: "交易维权",
                    path: "tradingRights",
                    component: () =>
                        import ("../views/page/guide/guideChildren/tradingRights.vue")
                },
                {
                    name: "客服中心",
                    path: "customerService",
                    component: () =>
                        import ("../views/page/guide/guideChildren/customerService.vue")
                },
                {
                    name: "积分商城规则",
                    path: "shopRules",
                    component: () =>
                        import ("../views/page/guide/guideChildren/shopRules.vue")
                }
            ]
        }, {
            path: '/notice',
            name: '公告',
            component: () =>
                import ("../views/page/shop/notice"),
            meta: {
                title: '系统公告-积分商城'
            }
        }

    ]
});

router.beforeEach((to, from, next) => {
    let localStorage = JSON.parse(window.localStorage["vuex-along"])["root"];
    /* 路由发生变化修改页面title */
    console.log(to)
    if (to.meta.title) {
        document.title = to.meta.title
    }
    //console.log(to)
    if (!localStorage && to.meta.role == 'Administrator') {
        next({
            path: '/login'
        })
    } else {
        next()
    }





})

export default router;