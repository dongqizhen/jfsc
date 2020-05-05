var g_encrypt = 1; //0=接口不加密 1=接口加密


//好医工项目接口使用
function toData(json) {
    var data = JSON.stringify(json);
    if (g_encrypt == 0) {
        return "data=" + data;
    } else {
        console.log('使用toData加密', data);
        data = aesEncrypt(data);
        return "data=" + encodeURIComponent(data);
    }
}

//积分商城项目接口使用
function new_to_Data(json) {
    var data = JSON.stringify(json);
    if (g_encrypt == 0) {
        return data;
    } else {
        console.log('使用new_to_Data加密', data);
        data = aesEncrypt(data);
        return encodeURIComponent(data);
    }
}

export {
    toData,
    new_to_Data
}