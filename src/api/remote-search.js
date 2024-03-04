import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue_wish/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue_wish/transaction/list',
    method: 'get',
    params: query
  })
}
