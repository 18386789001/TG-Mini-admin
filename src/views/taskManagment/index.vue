<template>
    <!-- 任务管理 -->
	<div class="table-admin-container layout-padding">
		<!-- 素材列表 -->
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
import { taskManagment } from '/@/api/taskManagment/index';

// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('/@/components/table/search.vue'));
const EditDialog = defineAsyncComponent(() => import('/@/views/user/lists/form/edit.vue'));

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
			{ key: 'createTime', colWidth: '', title: 'TASK TIME', type: 'text', isCheck: true },
			{ key: 'imgUrl', colWidth: '', width: '40', height: '40', title: 'TASK LOGO', type: 'image', isCheck: true },
			{ key: 'userId', colWidth: '', title: 'USER ID', type: 'text', isCheck: true },
			{ key: 'status', colWidth: '', title: 'AUDIT STATUS', type: 'radio', dict: { '1': 'has completed', '0': 'unfinished' }, isCheck: true },
			{ key: 'postContent', colWidth: '', title: 'TASK CONTENT', type: 'text', isCheck: true },
		],
		// 配置项（必传）
		config: {
			total: 0, // 列表总数
			loading: false, // loading 加载
			isBorder: false, // 是否显示表格边框
			isSerialNo: false, // 是否显示表格序号
			isSelection: false, // 是否显示表格多选
			// isOperate: true, // 是否显示表格操作栏
			isAdd: '', //新增标识
			isUpdate: '', //修改标识
			// isDelete: 'admin:user:del', //删除标识
			isPint:false,//是否开启打印
			isDown:false,//是否文件导出
		},
		// 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
		// search: [
		// 	{ label: '任务', prop: 'realname', placeholder: '请输入姓名', required: false, type: 'input' },
		// ],
		// 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
		param: {
			current: 1,
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
const getTableData = () => {
	state.tableData.config.loading = true
	taskManagment({}).then((response: any) => {
		state.tableData.config.loading = false
		console.log("任务管理：", response.data.records)
		state.tableData.data = response.data.records
	})
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
		ElMessage.success(`删除${row.id}成功！`);
	});
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
	state.tableData.param.current = page.page;
	state.tableData.param.size = page.size;
	// getTableData();
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
