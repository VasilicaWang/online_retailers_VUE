import request from '../utils/request.js'

export function getRights () {
  return request({
    url: 'rights/list',
    method: 'get'
  })
}

export function getRightsTree () {
  return request({
    url: 'rights/tree',
    method: 'get'
  })
}
