import request from '@/utils/request';

export async function reqAnnouncements(){
  return request('/announcement/list')
}
export async function reqAnnouncementDetail(payload){
  return request('/announcement/readDetail',{
    method:'get',
    params:payload
  })
}
export async function reqAnnouncementSave(payload){
  return request('/announcement/createAndSave',{
    method:'post',
    data:payload
  })
}
export async function reqAnnouncementDelete(payload){
  return request('/announcement/delete',{
    method:'get',
    params:payload
  })
}
export async function reqAnnouncementPublish(payload){
  return request('/announcement/publish',{
    method:'post',
    data:payload
  })
}
export async function reqSavedAnnouncementPublish(payload){
  return request('/announcement/publishSavedAnnouncement',{
    method:'get',
    params:payload
  })
}
export async function reqAnnouncementUpdate(payload){
  return request('/announcement/update',{
    method:'post',
    data:payload
  })
}
export async function reqAnnouncementCancelPublish(payload){
  return request('/announcement/cancelPublish',{
    method:'get',
    params:payload
  })
}
export async function reqAnnouncementByCondition(payload){
  return request('/announcement/queryByCondition',{
    method:'post',
    data:payload
  })
}