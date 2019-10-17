import { reqRegister } from './service';
import {message} from 'antd'

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(reqRegister, payload);
      if(response.status==='success'){
        message.success('注册成功！')
        window.location.href = '/user/login'
      }else{
        message.error('注册失败')
      }
        
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
