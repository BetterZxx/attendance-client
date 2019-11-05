import { reqRoleList,reqUpdateRole,reqDeleteRole } from './service';
import { message, Modal } from 'antd';

const Model = {
  namespace: 'role',
  state: {
    data:[]
  },
  effects: {
    *fetch({payload},{call,put}){
      const res = yield call(reqRoleList)
      if(res.code===0){
        yield put({
          type:'save',
          payload:res.data
        })
      }else{
        message.error(`请求失败:${res.msg}`)

      }
    },
    *delete({payload},{call,put}){
      console.log(payload)
      const res = yield call(reqDeleteRole,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'fetch'
        })
      }else{
        message.error(`删除失败${res.msg}`)
      }
    },
    *update({payload},{call,put}){
      const res = yield call(reqUpdateRole,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'fetch'
        })
      }else{
        message.error(`操作失败${res.msg}`)
      }
    },
  },
 
  reducers: {
    save(state,{payload}){
      return {...state,data:payload}
    }
  },
};
export default Model;
