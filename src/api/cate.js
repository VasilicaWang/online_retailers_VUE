import request from '../utils/request.js'

export function getCate (data) {
  return request({
    url: 'categories',
    method: 'get',
    params: data
  })
}

export function addCate (data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

export function deleteCate (id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}

export function editCate (id, catName) {
  return request({
    url: `categories/${id}`,
    method: 'put',
    data: { cat_name: catName }
  })
}
