import axios, { AxiosPromise } from 'axios';
import { makeUseAxios } from 'axios-hooks';

interface RequestParmas {
  Response?: any;
  Body?: any;
  Error?: any;
}

type ParamFromAxios = Parameters<typeof useAxios>;

axios.interceptors.request.use(
  (config) => {
    // 接口名
    config.headers!['X-TC-VERSION'] = 'xxxxx';
    config.headers!['x-requested-with'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (res) => {
    if (res.data.Response) {
      // 响应体统一剥离 Response
      res.data = res.data.Response;
    }
    // 可以处理特殊逻辑
    return res;
  },
  (error) => {

    if (error?.response?.status === 401) {
      window.location.replace(`/login?`);
    } else if (error?.response?.status === 403) {
      window.location.replace(`/noAccess`);
    }
    return Promise.reject(error);
  },
);

const useAxios = makeUseAxios({ axios });

const defaultMethod = 'get';

export const useRequest = <T extends RequestParmas>(...params: ParamFromAxios): [any, any, any] => {
  const [config, extra]: any = params;
  const isString = typeof config === 'string';
  const data: any = {
    ...config.data,
    DescribeCreator: true,
  };

  const configs = {
    ...(!isString && { config }),
    url: isString ? config : config?.url,
    data,
  }

  const [resp, refetch, manualCancel] = useAxios<T['Response'], T['Body'], T['Error']>(configs, {
    autoCancel: false,
    ...(extra || {}),
  });

  const refetchMethod = (newData?: Record<string, any> | undefined): AxiosPromise => {
    const refetchConfig: any = {};

    if ((config.method || defaultMethod).toUpperCase() === 'GET') {
      refetchConfig.params = {
        ...config.params,
        ...newData,
      };
    } else {
      refetchConfig.data = {
        ...data,
        ...(newData || {}),
      };
    }
    return refetch(refetchConfig).then((result) => result.data);
  };

  return [resp, refetchMethod, manualCancel];
};
