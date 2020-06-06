import Vue from 'vue'
import axios from 'axios'
//配置请求的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    config.headers.authorization = window.sessionStorage.getItem('token')
    // console.log(config)
    // 在最后一定要return config 固定写法
    return config
},error => {
    return Promise.rejecr(error)
})

Vue.prototype.$http = axios