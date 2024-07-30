import request from '/@/utils/request';
export function taskManagment(params:object) {
    return request({
        url: '/postinfo/page',
		method: 'get',
		data: params,
    })
}