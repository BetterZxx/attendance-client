import { queryCurrent, query as queryUsers, reqUserInfo } from '@/services/user';
import { routerRedux } from 'dva/router';
import {setAuthority} from '@/utils/authority'
import moment from 'moment';
const UserModel = {
  namespace: 'user',
  state: {
    userInfo: {
      unfinishTime: {
        h: 0,
        m: 0,
      },
    },
    rankUsers: [],
  },
  effects: {
    *getUsersInfo(_, { call, put }) {
      const studentID = localStorage.getItem('studentID');
      if (studentID) {
        const res = yield call(reqUserInfo, { studentID });
        console.log(res, res);
        if (res.status === 'success') {
          
          yield put({
            type: 'setUsersInfo',
            payload: res,
          });
        } else {
          yield put(routerRedux.replace('/user/login'));
        }
      } else {
        yield put(routerRedux.replace('/user/login'));
      }
    },
  },
  reducers: {
    setUsersInfo(state, { payload }) {
      console.log(111, payload);
      const { student, indexStudents, unfinishTime } = payload;
      //setAuthority(['admin',student.userRole])
      let interval = {
        h: 0,
        m: 0,
      };
      if (unfinishTime !== 0) {
        try {
          interval.h = Math.floor(moment().diff(moment(unfinishTime)) / 1000 / 60 / 60);
          interval.m = Math.floor((moment().diff(moment(unfinishTime)) / 1000 / 60) % 60);
        } catch (err) {
          console.log(err);
        }
        
        console.log(interval);
      }
      console.log('ddddddddd',moment(+unfinishTime).format('YYYY-MM-DD HH:mm'))
      let stu = indexStudents.find((item, index) => {
        return student.name === item.name;
      });
      let rank = indexStudents.findIndex(item => {
        return student.name === item.name;
      });
      stu.rank = rank + 1;
      return {
        ...state,
        userInfo: { ...student, ...stu, unfinishTime: interval },
        rankUsers: payload.indexStudents,
      };
    },
    updatePunch(state, { payload }) {
      return { ...state, userInfo: { ...state.userInfo, punch: payload } };
    },
  },
};
export default UserModel;
