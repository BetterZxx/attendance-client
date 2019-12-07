import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}
export async function reqUpdateStuInfo(params) {
  return request('/updateStudentInfo', {
    method: 'post',
    data: params,
  });
}
export async function reqUploadImg(params){
  return request('/uploadfile',{
    method:'post',
    data:params
  })
}