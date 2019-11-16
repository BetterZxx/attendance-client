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
export async function reqNameByFace(params){
  return request('/get_know_tokens',{
    method:'post',
    data:params
  })
}
