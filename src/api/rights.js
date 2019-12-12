import request from '../utils/request.js'

export function getRights () {
  return request({
    url: 'rights/list',
    method: 'get'
  })
}
