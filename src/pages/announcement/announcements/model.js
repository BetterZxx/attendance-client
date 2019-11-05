import {
  reqAnnouncements,
  reqAnnouncementDetail,
  reqAnnouncementDelete,
  reqAnnouncementPublish,
  reqAnnouncementSave,
  reqSavedAnnouncementPublish,
  reqAnnouncementUpdate,
  reqAnnouncementCancelPublish,
  reqAnnouncementByCondition
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'announcement',
  state: {
    data: [],
    isModify: false,
    detail: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqAnnouncements);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('请求出错')
      }
    },
    *filter({payload},{call,put}){
      const res = yield call(reqAnnouncementByCondition,payload)
      if(res.code===0){
        yield put({
          type:'save',
          payload: response.data
        })
      }
    }
    ,
    *getDetail({ payload }, { call, put }) {
      const res = yield call(reqAnnouncementDetail, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
      } else {
        message.error('获取公告详情失败');
      }
    },
    *saveAnnouncement({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementSave, payload);
      if (res.code === 0) {
        message.success('保存成功');
        yield put({
          type:'fetch'
        })
      } else {
        message.error('保存失败');
      }
    },
    *publish({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementPublish, payload);
      if (res.code === 0) {
        message.success('发布成功');
        yield put({
          type:'fetch'
        })
      } else {
        message.error('发布失败');
      }
    },
    *publishSaved({ payload }, { call, put }) {
      let res = yield call(reqSavedAnnouncementPublish, payload);
      if (res.code === 0) {
        message.success('发布成功');
        yield put({
          type:'fetch'
        })
        yield put({
          type:'getDetail',
          payload:{
            announcementId:payload.announcementId
          }
        })
      } else {
        message.error('发布失败');
      }
    },
    *delete({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementDelete, payload);
      if (res.code === 0) {
        message.success('删除成功');
        yield put({
          type:'fetch'
        })
      } else {
        message.error('删除失败');
      }
    },
    *cancelPublish({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementCancelPublish, payload);
      if (res.code === 0) {
        message.success('操作成功');
        yield put({
          type:'fetch'
        })
        yield put({
          type:'getDetail',
          payload:{
            announcementId:payload.announcementId
          }
        })
      } else {
        message.error('操作失败');
      }
    },
    *update({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementUpdate, payload);
      if (res.code === 0) {
        message.success('操作成功');
        yield put({
          type:'fetch'
        })
      } else {
        message.error('操作失败');
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    updateIsModify(state, { payload }) {
      return { ...state, isModify: payload };
    },
    saveDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
};
export default Model;
