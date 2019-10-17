import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function reqUserInfo(params) {
  return request('/getStudentAndPunchInfo', {
    method: 'post',
    data: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
