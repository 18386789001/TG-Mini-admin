import request from '/@/utils/request';
export function userInformation(params: object) {
	return request({
		url: '/userinfo/page',
		method: 'get',
		params: params,
	});
}