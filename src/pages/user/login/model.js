import { routerRedux } from 'dva/router';
import { reqLogin, reqUserInfo } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(reqLogin, payload);
      if (response.status === 'success') {
        message.success('登录成功');

        localStorage.setItem('studentID', payload.studentID);
        setAuthority(['admin', response.role]);
        if (response.status === 'success') {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }

          window.location.href = urlParams.origin
        }
      } else {
        message.error('用户名不存在或密码错误！');
      }

      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // }); // Login successfully
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
