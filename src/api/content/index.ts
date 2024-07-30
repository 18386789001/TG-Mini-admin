import request from '/@/utils/request';


//获取分页列表
export function getList(params: object) {
	return request({
		url: '/banner/getList',
		method: 'post',
		data: params,
	});
}

//获取全部菜单列表
export function getListAll(params: any) {
	return request({
		url: '/user/getlists',
		method: 'post',
		data: params,
	});
}


//获取全部列表
export function getListsIdName(params: any) {
	return request({
		url: '/user/getListsIdName',
		method: 'post',
		data: params,
	});
}

//获取详情
export function getinfo(id: String) {
	return request({
		url: '/banner/getinfo',
		method: 'post',
		data: { id },
	});
}

   
//保存
export function save(params: object) {
	return request({
		url: '/banner/save',
		method: 'post',
		data: params,
	});
}

//删除
export function del(id: String) {
	return request({
		url: '/banner/delete',
		method: 'post',
		data: { id },
	});
}
  
//改变字段值
export function edit(params:object) {
	return request({
		url: '/banner/edit',
		method: 'post',
		data:params
	})
}
  