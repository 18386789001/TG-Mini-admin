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
import { getList,del } from '/@/api/activity/index';

// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/table/search.vue'));
const EditDialog = defineAsyncComponent(() => import('/@/views/activity/list/form/edit.vue'));

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
			{ key: 'title', colWidth: '', title: '标题', type: 'text', isCheck: true },
			{ key: 'type', colWidth: '',  title: '类型', type: 'radio', dict: { '1': '首页', '2': '活动' }, isCheck: true },
			{key:'img',colWidth: '', title: '图片',width: '40', height: '40', type: 'image', isCheck: true},
			{key:'vedio',colWidth: '200', title: '视频',width: '180', height: '140', type: 'vedio',isCheck: true},
			{ key: 'content', colWidth: '', title: '内容', type: 'text', isCheck: true },
			{ key: 'describe', colWidth: '', title: '描述', type: 'text', isCheck: true },
			{ key: 'static', colWidth: '', title: '状态', type: 'radio', dict:{'1':'正常','0':'禁用'},isCheck: true },
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
			isAdd: 'banner:mode:add', //新增标识
			isUpdate: 'banner:mode:edit', //修改标识
			isDelete: 'admin:user:del', //删除标识
			isPint:false,//是否开启打印
			isDown:false,//是否文件导出
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		search: [
			{ label: '标题', prop: 'title', placeholder: '请输入...', required: false, type: 'input' },
			{
				label: '状态',
				prop: 'static',
				placeholder: '请选择',
				required: false,
				type: 'select',
				options: [
					{ label: '正常', value: 1 },
					{ label: '禁用', value: 0 },
				],
			}
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

// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
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
