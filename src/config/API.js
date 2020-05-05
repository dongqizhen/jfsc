'use strict';

const chalk = require('chalk');
const command = process.env.npm_lifecycle_event;
const _ = require('lodash')


let API_HOST = {};

//console.log(process.env)
let alpha = { // 开发
    //URL: "http://192.168.1.5:8083",
    URL: "http://106.13.39.6:8083",
    HYGLOGINURL: "http://webtest.haoyigong.com",
    HYGINFOURL: "http://infotest.haoyigong.com",
    HYGPROURL: "http://protest.haoyigong.com",
    HYGFILEURL: "http://shoptest.allbring.com/platform",
}
let beta = { // 测试
    URL: "https://www.api/code",
    BASE_URL: "https://www.api/code"
}
let gamma = { // 验收版本
    URL: "http://shopple.allbring.com/platform",
    HYGLOGINURL: "http://webple.haoyigong.com",
    HYGINFOURL: "http://infople.haoyigong.com",
    HYGPROURL: "http://prople.haoyigong.com",
    HYGFILEURL: "http://shopple.allbring.com/platform",
}
let release = { // 正式版本
    URL: "http://shop.allbring.com/platform",
    HYGLOGINURL: 'http://web.haoyigong.com',
    HYGINFOURL: "http://info.haoyigong.com",
    HYGPROURL: "http://pro.haoyigong.com",
    HYGFILEURL: "http://file.allbring.com/platform",
}

console.log(command)
if (_.endsWith(command, ':alpha')) {
    console.log(chalk.green(`当前环境为（${process.env.NODE_ENV}）:开发`));
    API_HOST = alpha;
} else if (_.endsWith(command, ':beta')) {
    console.log(chalk.green(`当前环境为（${process.env.NODE_ENV}）:测试)`));
    API_HOST = beta;
} else if (_.endsWith(command, ':gamma')) {
    console.log(chalk.green(`当前环境为（${process.env.NODE_ENV}）:验收`));
    API_HOST = gamma;
} else if (_.endsWith(command, ':release')) {
    console.log(chalk.green(`当前环境为（${process.env.NODE_ENV}）:正式`));
    API_HOST = release;
} else {
    console.log(chalk.green(`当前环境为（${process.env.NODE_ENV}）:开发`));
    API_HOST = alpha;
}


module.exports = {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    API_HOST: JSON.stringify(API_HOST)
}