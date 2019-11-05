import request from '@/utils/request';

export async function reqPunchChart(){
  return request('/getPunchChart')
}

