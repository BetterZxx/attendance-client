import request from '@/utils/request';

export async function reqRegister(params) {
  return request('/register', {
    method: 'POST',
    data: params,
  });
}
export async function reqAddToken(params){
  return request('/add_tokens',{
    method:'post',
    data:params
  })
}
export async function reqAddImage(params){
  return request('/add_images',{
    method:'post',
    data:params
  })
}
