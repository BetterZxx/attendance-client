import { queryCurrent, query as queryUsers,reqUserInfo } from '@/services/user';
import { routerRedux } from 'dva/router';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userInfo:{},
    rankUsers:[]
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getUsersInfo(_, { call, put }) {
      const studentID = localStorage.getItem('studentID')
      if(studentID){
        const res = yield call(reqUserInfo, {studentID});
        yield put({
          type: 'setUsersInfo',
          payload: res,
        });
      }else{
        yield put(routerRedux.replace('/user/login'));
      }
      
      
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    setUsersInfo(state,{payload}){
      console.log(111,payload)
      const {student,indexStudents} = payload
      let stu =  indexStudents.find((item,index)=>{
        return student.name===item.name
      })
      let rank =  indexStudents.findIndex((item)=>{
        return student.name===item.name
      })
      stu.rank = rank+1
      return {...state,userInfo:{...student,...stu},rankUsers:payload.indexStudents}
    },
    updatePunch(state,{payload}){
      return {...state,userInfo:{...state.userInfo,punch:payload}}
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
