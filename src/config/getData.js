import axios from './axios'
import router from '../router';

export async function _getData(url = '', data = {}, config = {}) {

    if (!data.userid) {
        delete data.userid
    }
    return await axios.post(url, {
        ... {},

        ...data
    }, config).then(data => {
        console.log(data)
        if (data.code == 0 || data.code == 200) {
            // console.log(router)
            if (data.code == 200) {
                return data
            } else {
                return data.result
            }

        } else if (data.code == 401) {
            const v = router.app.$children[0];
            router.app.$store.state.isLogin = false;
            let localStorage = JSON.parse(window.localStorage["vuex-along"])["root"];
            localStorage.isLogin = false;
            if (!v.visible && localStorage) {
                v.showNote()
            }

        } else {
            //console.log(router)
            if (!(data.code == 1116 || data.code == 1106)) {
                const v = router.app.$children[0];
                v
                    .$message
                    .error(data.msg)

            }

            return data
        }

    }).catch(err => {
        // /* if (errorCallBack) {     errorCallBack(err) } else {     console.log(err)
        // } */
    })
}

export async function _getDataAll(funArr = []) {
    return await axios
        .all(funArr)
        .then(axios.spread(function(acct, perms) {
            // 两个请求现在都执行完成
            return true
        }));
}

export async function __getData(url = '', data = {}, config = {}) {
    return await axios.get(url, {
        params: {... {},
            ...data
        }
    }, config).then((data) => {
        if (data.code == 0 || data.code == 200) {
            // console.log(router)
            if (data.code == 200) {
                return data
            } else {
                return data.result
            }

        }
    })
}