import axios from 'axios'
const baseURL = 'http://127.0.0.1:8000/'

class Api {
    static post(route, params){
        return this.request(route, params, 'post')
    }
    static request(route, params, verb) {
        const host = baseURL;
        const url = `${host}${route}`;
        const options = { method: verb, data: params };
        options.headers = {}
        options.crossOrigin = true
        console.log(`Options*******************${JSON.stringify(options)}`);
        console.log(`URL*********************${JSON.stringify(url)}`);
        console.log(url, options)
        return axios(url, options);
      }
}

export default Api