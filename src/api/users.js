import request from '../utils/request'

export function getUser (data) {
  return request({
    url: 'users',
    method: 'get',
    params: data
  })
}

export function addUser (data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

export function changeState (id, state) {
  return request({
    url: `users/${id}/state/${state}`,
    method: 'put'
  })
}

export function editUser (id, data) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser (id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

export function changeUserRole (id, roleId) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: { rid: roleId }
  })
}
