import request from '/@/utils/request';


//获取分页列表
export function getList(params: object) {
	return request({
		url: '/activity/getList',
		method: 'post',
		data: params,
	});
}


//获取详情
export function getinfo(id: String) {
	return request({
		url: '/activity/getinfo',
		method: 'post',
		data: { id },
	});
}

   
//保存
export function save(params: object) {
	return request({
		url: '/activity/save',
		method: 'post',
		data: params,
	});
}

//删除
export function del(id: String) {
	return request({
		url: '/activity/delete',
		method: 'post',
		data: { id },
	});
}
  
//改变字段值
export function edit(params:object) {
	return request({
		url: '/activity/edit',
		method: 'post',
		data:params
	})
}
  