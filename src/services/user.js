import request from '@/utils/request';
export async function reqUserInfo(params) {
  return request('/getStudentAndPunchInfo', {
    method: 'post',
    data: params,
  });
}

