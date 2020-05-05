/*
 * @Author: mikey.dongqizhen
 * @Date: 2019-04-18 17:08:47
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2020-05-05 16:37:44
 */


// config axios https://www.jianshu.com/p/7a9fbcbb1114
import axios from 'axios'
import {
    toData,
    new_to_Data
} from './jsonData'

let request = axios.create();
//console.log(window.localStorage["vuex-along"])

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let cancel = null
let removePending = (ever) => {
    for (let p in pending) {
        if (pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
}

//添加请求拦截器
axios.interceptors.request.use(function(config) {
    if (config.url.indexOf('!request.action') == -1) {
        let token;
        if (window.localStorage["vuex-along"] != "{}") {
            token = JSON.parse(window.localStorage["vuex-along"])['root'].userInfo.token
        }
        config.headers['token'] = token
        config.transformRequest = [
            (data) => {
                console.log(data)
                    //return new_to_Data(data)
                return JSON.stringify(data)
            }
        ]
    } else {
        config.headers['Content-Type'] = "application/x-www-form-urlencoded"
        config.transformRequest = [
            (data) => {
                return toData(data)
            }
        ]
    }
    removePending(config); //在一个ajax发送前执行一下取消操作
    // config.cancelToken = new cancelToken((c) => {
    //     // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    //     // pending.push({
    //     //     u: config.url + '&' + config.method,
    //     //     f: c
    //     // });
    //     cancel = c

    // });
    // console.log("aaaaaaaaaaaaaaa", pending)
    return config;

}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    console.log(response)

    //removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // console.log("bbbbbbbbb", pending)
    if (response.config.url.indexOf('!request.action') == -1) {
        return response.data
    } else {
        return {
            result: response.data.result,
            code: response.data.status.code,
            msg: response.data.status.message
        }
    }

    // 对响应数据做点什么
    // return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


axios.defaults.timeout = 1000000 //请求超时时间
axios.withCredentials = false // 是否携带cookie信息
axios.responseType = `json`
axios.defaults.headers.post['Content-Type'] = 'application/json';
// if (token) {
//     //request.defaults.headers.common['X-Nideshop-Token'] = token;
// }

axios.defaults.transformRequest = [ //`transformRequest`选项允许我们在请求发送到服务器之前对请求的数据做出一些改动该选项只适用于以下请求方式：`put/post/patch`数组里面的最后一个函数必须返回一个字符串、-一个`ArrayBuffer`或者`Stream`
    (data) => {

        return new_to_Data(data)
    }
]
axios.defaults.baseURL = ``; //如果url不是绝对路径，那么会将baseURL和url拼接作为请求的接口地址



// request.defaults.adapter = function(config) {
//     /* ... */
//     console.log(config)
// }


export default axios