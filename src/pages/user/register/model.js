import { reqRegister,reqAddImage,reqAddToken } from './service';
import {message} from 'antd'
import { routerRedux } from 'dva/router';

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
        yield put(routerRedux.replace('/user/login'));
      }else{
        message.error('注册失败')
      }
        
    },
    *upload({payload},{call,put}){
      const res = yield call(reqAddToken,payload.formData)
      if(res.suc_message){
        const res1 = yield call(reqAddImage,payload.formData)
        if(res1.suc_message){
          yield put({
            type:'submit',
            payload:payload.data
          })
        }else{
          message.error('上传图片失败')
        }
      }else{
        message.error('上传token失败')
      }
    }
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
