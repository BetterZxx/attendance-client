import { reqEndPunch, reqStartPunch } from './service';
import { message, Modal } from 'antd';

const Model = {
  namespace: 'home',
  state: {
    currentUser: {},
    projectNotice: [],
    activities: [],
    radarData: [],
  },
  effects: {
    *startPunch({ payload }, { call, put }) {
      const res = yield call(reqStartPunch, payload);
      if (res.status === 'success') {
        message.success('打卡成功');
        yield put({
          type: 'user/getUsersInfo',
          payload: true,
        });
      } else if (res.status === 'fail') {
        Modal.warning({
          title: '打卡失败',
          content: `${res.msg}`,
        });
      } else {
        message.error('打卡异常');
      }
    },
    *endPunch({ payload }, { call, put }) {
      const res = yield call(reqEndPunch, payload);
      if (res.status === 'success') {
        message.success('签退成功');
        yield put({
          type: 'user/getUsersInfo',
          payload: true,
        });
      } else if (res.status === 'fail') {
        Modal.warning({
          title: '打卡失败',
          content: `${res.msg}`,
        });
      } else {
        message.error('签退异常');
      }
    },
  },
  reducers: {},
};
export default Model;
