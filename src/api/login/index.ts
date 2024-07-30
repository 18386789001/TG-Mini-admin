import request from '/@/utils/request';

//登录
export function login(params: object) {
	return request({
		url: '/admin/login',
		method: 'post',
		data: params,
	});
}
//验证码
export function captcha() {
	return request({
		url: '/system/getverify',
		method: 'get',
	})
  }