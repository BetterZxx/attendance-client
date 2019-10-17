import { fakeChartData, queryActivities, queryCurrent, queryProjectNotice,reqEndPunch,reqStartPunch } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'dashboardWorkplace',
  state: {
    currentUser: {},
    projectNotice: [],
    activities: [],
    radarData: [],

  },
  effects: {
    *init(_, { put }) {
      yield put({
        type: 'fetchUserCurrent',
      });
      yield put({
        type: 'fetchProjectNotice',
      });
      yield put({
        type: 'fetchActivitiesList',
      });
      yield put({
        type: 'fetchChart',
      });
    },

    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response,
        },
      });
    },
    *startPunch({payload},{call,put}){
      const res = yield call(reqStartPunch,payload)
      if(res.status==='success'){
        message.success('打卡成功')
        yield put ({
          type: 'user/getUsersInfo',
          payload: true
        })
      }else{
        message.error('打卡异常')

      }
    },
    *endPunch({payload},{call,put}){
      
      const res = yield call(reqEndPunch,payload)
      if(res.status==='success'){
        message.success('签退成功')
        yield put ({
          type: 'user/getUsersInfo',
          payload: true
        })
      }else{
        message.error('签退异常')

      }
    },

    *fetchProjectNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response) ? response : [],
        },
      });
    },

    *fetchActivitiesList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response) ? response : [],
        },
      });
    },

    *fetchChart(_, { call, put }) {
      const { radarData } = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          radarData,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },


    clear() {
      return {
        currentUser: {},
        projectNotice: [],
        activities: [],
        radarData: [],
      };
    },
  },
};
export default Model;
