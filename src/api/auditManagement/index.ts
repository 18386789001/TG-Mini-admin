import request from '/@/utils/request';
export function auditGetFun(params: object) {
    return request({
        url: '/meme/page',
		method: 'get',
		data: params,
    })
}
export function auditPassTwo(params: object) {
    return request({
        url: '/meme/verify',
		method: 'post',
		data: params,
    })
}