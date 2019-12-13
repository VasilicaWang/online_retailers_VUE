import request from '../utils/request.js'

export function getGoods (data) {
  return request({
    url: 'goods',
    method: 'get',
    params: data
  })
}
