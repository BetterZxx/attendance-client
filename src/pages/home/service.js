import request from '@/utils/request';

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
