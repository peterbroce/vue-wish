import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue_wish/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue_wish/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue_wish/user/logout',
    method: 'post'
  })
}
