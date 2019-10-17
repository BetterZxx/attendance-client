import request from '@/utils/request';

export async function reqLogin(params) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}
export async function reqUserInfo(params) {
  return request('/getStudentAndPunchInfo', {
    method: 'post',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
