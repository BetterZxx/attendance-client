import request from '@/utils/request';

export async function reqRoleList(params) {
  return request('/getRegisterUserList')
}
export async function reqUpdateRole(params) {
  return request('/updateUserRole', {
    method: 'post',
    data: params,
  });
}
export async function reqDeleteRole(params){
  return request('/deleteUser',{
    method:'get',
    params
  })
}
