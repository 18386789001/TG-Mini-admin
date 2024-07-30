<template>
	<div class="table-admin-container layout-padding">
		<div class="table-admin-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.tableData.search" :isAdd="state.tableData.config.isAdd" @search="onSearch" @add="onTableAddRow"/>
			<Table
				ref="tableRef"
				v-bind="state.tableData"
				class="table-admin"
				@updateRow="onTableUpdateRow"
				@delRow="onTableDelRow"
				@pageChange="onTablePageChange"
				@sortHeader="onSortHeader"
			/>
		</div>
		<EditDialog  ref="editRef"  @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getList,del,change } from '/@/api/alliance/index';


// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/table/search.vue'));
const EditDialog = defineAsyncComponent(() => import('/@/views/alliance/list/form/edit.vue'));

// 定义变量内容
const tableRef = ref<RefType>();
const editRef = ref();
const state = reactive<TableDemoState>({
	tableData: {
		// 列表数据（必传）
		data: [],
		// 表头内容（必传，注意格式）
		header: [
			{ key: 'id', colWidth: '80', title: 'ID', type: 'text', isCheck: true },
			{ key: 'name', colWidth: '', title: '姓名', type: 'text', isCheck: true },
			{ key: 'photo', colWidth: '', width: '40', height: '40', title: '头像', type: 'image', isCheck: true },
			{ key: 'trade_name', colWidth: '', title: '店名', type: 'text', isCheck: true },
			{ key: 'email', colWidth: '', title: '邮箱', type: 'text', isCheck: true },
			{ key: 'phone', colWidth: '', title: '手机', type: 'text',isCheck: true },
			{ key:'account',colWidth: '', title: '账号', type: 'text',isCheck: true},
			{ key: 'static', colWidth: '', title: 'openid', type: 'radio', dict:{'1':'审核通过','0':'申请中','2':'待审核'},isCheck: true },
			{ key: 'create_time', colWidth: '180', title: '创建时间', type: 'text', isCheck: true },
			
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: true, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: false, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			isOperate: true, // 是否显示表格操作栏
			isAdd: 'system:mode:add', //新增标识
			isUpdate: 'system:mode:edit', //修改标识
			isDelete: 'admin:user:del', //删除标识
			isPint:false,//是否开启打印
			isDown:false,//是否文件导出
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '手机', prop: 'phone', placeholder: '请输入手机', required: false, type: 'input' },
			{
				label: '状态',
				prop: 'static',
				placeholder: '请选择',
				required: false,
				type: 'select',
				options: [
					{ label: '已通过', value: 1 },
					{ label: '申请中', value: 0 },
					{ label: '待审核', value: 2 },
				],
			},
		],
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		param: {
			page: 1,
			size: 10,
		},
		// 打印标题
		printName: '数据打印',
		//列字典
		dictData:{
			groups:[],//角色
		},
	},
	
});
// 初始化列表数据
const getTableData =  () => {
	state.tableData.config.loading = true;
	state.tableData.data = [];
	getList(state.tableData.param).then((response: any) => {
		state.tableData.data = response.data.data;
		state.tableData.config.total = response.data.total;
		state.tableData.config.loading = false;
	});
};
const removeEmptyProperties = (obj:any) =>{
    Object.keys(obj).forEach(key => (obj[key] === null || obj[key] === undefined || obj[key] === '') && delete obj[key]);
}
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType,num:any) => {
	if(!num) removeEmptyProperties(data)
	state.tableData.param = Object.assign({}, state.tableData.param, { ...data });
	tableRef.value.pageReset();
};

// 删除当前项回调
const onTableDelRow = (row: EmptyObjectType) => {
	return del(row.id).then(() => {
		getTableData();
		ElMessage.success(`删除成功！`);
	});
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.param.page = page.page;
	state.tableData.param.size = page.size;
	getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
	state.tableData.header = data;
};

/** 新增按钮操作 */
const onTableAddRow = () => {
	editRef.value.openDialog('add');
};
/** 修改按钮操作 */
const onTableUpdateRow = (row: any) => {
	editRef.value.openDialog('edit',row);
};


// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.table-admin-container {
	.table-admin-padding {
		padding: 15px;
		.table-admin {
			flex: 1;
			overflow: hidden;
		}
	}
}
</style>
