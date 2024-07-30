
import { ru } from 'element-plus/es/locale';

import singleImageVue from '/@/components/Upload/singleImage.vue';
<template>
    <div class="system-menu-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
            <el-form ref="dialogFormRef" :model="state.ruleForm" :rules="state.ruleRules" size="default" label-width="120px">
                <el-row :gutter="35">
              
                    <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="Logo" >
                            <singleImageVue></singleImageVue>
                        </el-form-item>
                    </el-col>
                     -->
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="Task name" prop="describe">
                            <el-input v-model="state.ruleForm.describe" placeholder="Please enter a task name" clearable></el-input>
                        </el-form-item>
                    </el-col>
               
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="Integral" prop="points">
                            <el-input v-model="state.ruleForm.points" placeholder="Please enter integral" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb20">
                        <el-form-item label="path" prop="url">
                            <el-input v-model="state.ruleForm.url" placeholder="Please enter path " clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="onCancel" size="default">cancel</el-button>
                    <el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemMenuForm">
import { defineAsyncComponent, reactive, onMounted, ref, unref, nextTick } from 'vue';
import { getListAll, getinfo, save, editUpdate } from '/@/api/menu/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { handleTree } from '/@/utils';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const singleImageVue = defineAsyncComponent(() => import('/@/components/Upload/singleImage.vue'));
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const dialogFormRef = ref();
const state = reactive({
    ruleForm: {
        id: 0,
        describe: '', // 菜单名称
        url: '', // 组件路径
        type: '', // 菜单图标
        points: '',
      
    },
    menuData: [], // 上级菜单数据
    dialog: {
        isShowDialog: false,
        type: '',
        title: '',
        submitTxt: '',
    },
    // 表单校验
    ruleRules: {
        describe: [{ required: true, message: 'can not be empty', trigger: 'blur' }],
        points: [{ required: true, message: 'can not be empty', trigger: 'blur' }],
    },
    loading: false,
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
    if (type === 'edit') {
        // 实际请走接口
        console.log('row', row)
        state.ruleForm = row
        state.dialog.title = 'Modify menu';
        state.dialog.submitTxt = 'Amend';
    } else {
        state.dialog.title = '新增菜单';
        state.dialog.submitTxt = '新 增';
        // 清空表单，此项需加表单验证才能使用
        nextTick(() => {
            dialogFormRef.value.resetFields();
            initForm();
        });
    }
    state.dialog.type = type;
    state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
    initForm();
    state.dialog.isShowDialog = false;
};
// 是否内嵌下拉改变
const onSelectIframeChange = () => {
    if (state.ruleForm.is_iframe) state.ruleForm.is_link = 1;
    else state.ruleForm.is_link = 0;
};
// 取消
const onCancel = () => {
    closeDialog();
};
// 提交
const onSubmit = () => {

    const formWrap = unref(dialogFormRef) as any;
    if (!formWrap) return;
    formWrap.validate((valid: boolean) => {
        if (valid) {
            state.loading = true;
            
            
            const params = {
                id: state.ruleForm.id,
                describe: state.ruleForm.describe,
                url: state.ruleForm.url,
                points: state.ruleForm.points,
                type:state.ruleForm.type
            }
            editUpdate(params).then(() => {
                ElMessage.success('modify successfully');
                state.loading = false;
                closeDialog(); // 关闭弹窗
                emit('refresh');

            }).finally(() => {
                state.loading = false;
            });

        }
    })
};
// 页面加载时
onMounted(() => {

});


// 表单初始化，方法：`resetFields()` 无法使用
const initForm = () => {
    state.ruleForm.id = 0;
    state.ruleForm.component = '';
    state.ruleForm.icon = '';
    state.ruleForm.is_affix = 0;
    state.ruleForm.is_hide = 0;
    state.ruleForm.is_iframe = 0;
    state.ruleForm.is_keep_alive = 1;
    state.ruleForm.is_link = 0;
    state.ruleForm.menu_type = 'menu';// 菜单类型;
    state.ruleForm.parent_id = 0;
    state.ruleForm.path = '';
    state.ruleForm.sorts = 1;
    state.ruleForm.static = 1;
    state.ruleForm.name = '';
    state.ruleForm.permission = ''
};

// 暴露变量
defineExpose({
    openDialog,
});
</script>
