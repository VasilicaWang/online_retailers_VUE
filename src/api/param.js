import request from '../utils/request.js'

export function getParams (id, data) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: { sel: data }
  })
}
