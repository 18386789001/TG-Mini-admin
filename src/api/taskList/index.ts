import request from '/@/utils/request';
export function taskListFundata(params:object) {
    return request({
        url: '/taskinfo/page',
		method: 'get',
		params: params,
    })
}