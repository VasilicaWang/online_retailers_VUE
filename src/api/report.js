import request from '../utils/request.js'

export function getData () {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}
