import { reqEndPunch, reqStartPunch,reqNameByFace } from './service';
import { message, Modal } from 'antd';
function decodeUnicode(str) { 
  str = str.replace(/\\/g, "%"); return unescape(str);
}
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
        message.success('ip认证成功,正在打卡');
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
    *checkFace({payload},{call,put}){
      const res = yield call(reqNameByFace,payload.formData)
      const {name,data} = payload
      if(res.face_name){
        let realName =  decodeUnicode(res.face_name)
        if(name === realName){
          message.success('人脸识别成功，开始ip认证')
          yield put({
            type:'startPunch',
            payload:data
          })
        }else{
          message.error('人脸识别非本人，打卡失败！')
        }
      }else{
        message.error(`服务器异常:${res.err_message}`)

      }
    }
    ,
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
