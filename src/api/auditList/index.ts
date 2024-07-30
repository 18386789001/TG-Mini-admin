import request from '/@/utils/request';
export function auditList(params:object) {
    return request({
        url: '/postinfo/page',
		method: 'get',
		params: params,
    })
}
export function auditPass(params:object) {
    return request({
        url: '/postinfo/verify',
		method: 'post',
		data: params,
    })
}