import request from '../utils/request'

export function getRoles () {
  return request({
    url: 'roles',
    method: 'get'
  })
}

export function addRole (data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}

export function editRole (id, data) {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole (id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

export function deleteRoleRight (roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export function allocationRight (roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
