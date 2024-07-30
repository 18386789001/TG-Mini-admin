<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" :rules="state.ruleRules" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="12" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="活动图片"  prop="wx_img">
							<Uploadimg v-model="state.ruleForm.img" :value="state.ruleForm.img" @upload="onUpload" :msg="state.msg"/>
						</el-form-item>
					</el-col>
					
					<el-col :xs="12" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="客服二维码"  prop="wx_img" >
								<Uploadimg v-model="state.ruleForm.wx_img" :value="state.ruleForm.wx_img" @upload="onUpload1" :msg="state.msg"/>
							</el-form-item>
						</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="活动标题" prop="title">
							<el-input v-model="state.ruleForm.title" placeholder="请输入标题" clearable></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="活动内容" prop="content">
							<el-input type="textarea" v-model="state.ruleForm.content" placeholder="请输入内容" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="活动时间" prop="type">
							<el-radio-group v-model="state.ruleForm.type">
								<el-radio :label="1">本周</el-radio>
								<el-radio :label="2">本月</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="static">
							<el-radio-group v-model="state.ruleForm.static">
								<el-radio :label="1">正常</el-radio>
								<el-radio :label="0">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="描述" prop="describe">
							
						</el-form-item>
					</el-col>

					
				
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserForm">
import { reactive,defineAsyncComponent, onMounted, ref ,unref,nextTick} from 'vue';
import { getinfo,save,edit } from '/@/api/activity/index';
import {  ElMessage } from 'element-plus';

const Uploadimg = defineAsyncComponent(() => import('/@/components/Upload/singleImage.vue'));

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dialogFormRef = ref();
const state = reactive({
	ruleForm: {
		static: 1, 
		type: 1, 
		content: '', 
		title:'',
		wx_img: '',
		img:'', 
		describe:''
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	// 表单校验
	ruleRules: {
		title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
		img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
		sorts:[{ required: true, message: '请输入排序', trigger: 'blur' }]
	},
	loading: false,
	msg:'',
});

const onUpload = (data:any) => {
	state.ruleForm.img = data;
};
const onUpload1 = (data: any) => {
	state.ruleForm.wx_img = data;
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'edit') {
		// 实际请走接口
		getinfo(row.id).then((response: any) => {
			state.ruleForm.id = response.data.id;
			state.ruleForm.title = response.data.title;
			state.ruleForm.content = response.data.content;
			state.ruleForm.describe = response.data.describe;
			state.ruleForm.img = response.data.img;
			state.ruleForm.wx_img = response.data.wx_img;
			
		});
		
		state.dialog.title = '修改';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增';
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
			if (state.dialog.submitTxt == '新 增') {
				save(state.ruleForm).then(() => {
						ElMessage.success('保存成功');
						state.loading = false;
						closeDialog(); // 关闭弹窗
						emit('refresh');
					})
					.finally(() => {
						state.loading = false;
					});
				return
			}
			edit(state.ruleForm).then(() => {
				ElMessage.success('操作成功');
				state.loading = false;
				closeDialog(); // 关闭弹窗
				emit('refresh');
			})
				.finally(() => {
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
	state.ruleForm.title ='';
	state.ruleForm.wx_img = '';
	state.ruleForm.content = '';
	state.ruleForm.describe = '';
	state.ruleForm.type = 1;
	state.ruleForm.static = 1;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
