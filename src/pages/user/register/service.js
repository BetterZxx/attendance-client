import request from '@/utils/request';

export async function reqRegister(params) {
  return request('/register', {
    method: 'POST',
    data: params,
  });
}
