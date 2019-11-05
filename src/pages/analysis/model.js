import {
  reqPunchChart
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'analysis',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqPunchChart);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('请求出错')
      }
    }  
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    }
  },
};
export default Model;
