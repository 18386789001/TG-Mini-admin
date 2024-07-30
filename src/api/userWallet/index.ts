import request from '/@/utils/request';
export function userWallet(params: object) {
	return request({
		url: '/walletinfo/page',
		method: 'get',
		params: params,
	});
}