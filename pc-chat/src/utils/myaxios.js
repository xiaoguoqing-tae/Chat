import axios from "axios";
// import { Loading } from "element-ui";
// import { localStorage } from "@/storage";

const fetch = ({ url, method, params } = {}) => {
  // let fetchLoading;
  let _opt = {
    'method':method,
    'url':url,
    'data':params
  };
  const instance = axios.create({
    baseURL:"http://localhost:3000"
  });
  instance.interceptors.request.use(
    config => {
      config.headers = {
        ...config.headers
      };
      // fetchLoading = Loading.service({ text: "开始请求" });
      return config;
    },
    error => {
      console.log("请求失败");
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    res => {
      // fetchLoading.setText("请求完成");
      setTimeout(() => {
        // fetchLoading.close();
      }, 500);
      return res;
    },
    err => {
      console.log("返回失败");
      return Promise.reject(err);
    }
  );
  return new Promise((resolve, reject) => {
    instance(_opt)
      .then(res => {
        if (res.status === 200 || res.status === 400) {
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default fetch;