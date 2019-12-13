import request from '../utils/request.js'

export function getOrder (data) {
  return request({
    url: 'orders',
    method: 'get',
    params: data
  })
}

export function viewProgress () {
  return request({
    url: '/kuaidi/1106975712662',
    method: 'get'
  })
}
