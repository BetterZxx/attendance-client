import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}
export async function queryActivities() {
  return request('/api/activities');
}
export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function reqStartPunch(params) {
  return request('/startPunch', {
    method: 'post',
    data: params,
  });
}
export async function reqEndPunch(params) {
  return request('/endPunch', {
    method: 'post',
    data: params,
  });
}
