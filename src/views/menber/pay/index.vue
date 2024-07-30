<template>
    <div class="table-admin-container layout-padding">
       <div class="table-admin-padding layout-padding-view layout-padding-auto">
        
            <div style="width: 455px;margin: 10px auto; ">
                <h2 style="margin: 20px;">配置会员支付信息</h2>
                <el-form ref="dialogFormRef" style="margin-top: 60px;" :model="state.form" label-width="80px">
                    <el-form-item label="会员金额" prop="price">
                        <el-input v-model="state.form.price" placeholder="请输入..." type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="会员标题" prop="title">
                        <el-input v-model="state.form.title" placeholder="请输入..." type="number"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="saveClick">修改配置</el-button>
                    
                    </el-form-item>
                
                </el-form>
            </div>
       </div>
    </div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getList, del, change } from '/@/api/user/index';

const state = reactive<uFormState>({
    loading: false,
    form: {
       price: 0.01,
       title:''
    },
    ruleRules: {
        price: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '会员标题不能为空', trigger: 'blur' }],
    },
})
const saveClick = () => {
    console.log('确定修改')
    const formWrap = unref(dialogFormRef) as any;
}

// 定义变量内容
const dialogFormRef = ref();
// 初始化列表数据
const getTableData = () => {
    // state.loading = true;
    getList().then((response: any) => {
        // state.uFrom = response.data.data;
        // state.loading = false;
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
        ElMessage.success(`删除${row.id}成功！`);
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
    editRef.value.openDialog('edit', row);
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
