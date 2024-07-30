<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" :rules="state.ruleRules" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="12" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="图片 logo				" prop="photo">
							<Uploadimg v-model="state.ruleForm.photo" :value="state.ruleForm.photo"  :msg="state.msg" @uploadvedio="onUploadvedio"/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="店名" prop="trade_name">
							<el-input v-model="state.ruleForm.trade_name" placeholder="请输入店名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入姓名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="电话" prop="phone">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入电话" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账号" prop="account">
							<el-input v-model="state.ruleForm.account" placeholder="请输入账号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="密码" prop="password">
							<el-input show-password v-model="state.ruleForm.password" type="password" placeholder="请输入密码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="重复密码" prop="repassword">
							<el-input show-password v-model="state.ruleForm.repassword" type="password" placeholder="请再次输入密码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="state.ruleForm.email" placeholder="请输入邮箱" clearable></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="地区" prop="cascList">
							<el-cascader placeholder="请选择地区" @change="cascaderChange" :props="cascaderProps.props" :options="cascaderProps.options" v-model="state.ruleForm.cascList" clearable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="详细地址" prop="address">
							<el-input type="textarea" v-model="state.ruleForm.address" placeholder="请输入详细地址" clearable></el-input>
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
import { getinfo,save } from '/@/api/alliance/index';
import {  ElMessage } from 'element-plus';
import city from '/@/utils/City.json';
import { da } from 'element-plus/es/locale';
import { any } from 'video.js/dist/types/utils/events';
const Uploadimg = defineAsyncComponent(() => import('/@/components/Upload/singleImage.vue'));


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dialogFormRef = ref();
const cascaderProps = reactive({
	options:city,
	props:{
		value:'code',
		label:'name',
		children:'city'
	}
})
const state = reactive({
	
	ruleForm: {
		static: 1, 
		type: 1, 
		city: '', 
		name:'',
		photo: '', 
		trade_name:'',
		province:'',
		district:'',
		address:'',
		password:'', 
		email:'',
		account:'',
		phone:'',
		repassword:'',
		cascList:[] as any,
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	// 表单校验
	ruleRules: {
		trade_name: [{ required: true, message: '店名不能为空', trigger: 'blur' }],
		name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
		// photo: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
		phone:[
			{ required: true, message: '手机号不能为空', trigger: 'blur' },
			{  pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
		],
		email: [
			{required: true, trigger: "blur", message: "请填写邮箱", },
			{pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址', trigger: 'blur'  }
		],
		cascList:[{ required: true, message: '请选择地区', trigger: 'blur' }],
		address:[{ required: true, message: '请填写详细地址', trigger: 'blur' }],
		account:[{ required: true, message: '请填写账号', trigger: 'blur' }],
		password:[
			{ required: true, message: '请填写密码', trigger: 'blur' },
			{min: 6,max: 16,message: '长度应在 6 到 16 个字符',trigger: 'blur' },
			{ validator:  (rule: any, value: string, callback: any) => {
					if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,16}$/g.test(value)) {
						callback()
					} else {
						callback(new Error('需包含英文字母大小写、数字和特殊符号'))
					}
				}, trigger: 'blur'
			}
		],
		repassword:[
		{ required: true, message: '请再输入一遍新密码', trigger: 'blur' },
          { validator: (rule: any, value: string, callback: any) => {
			if (value !== state.ruleForm.password) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}}, trigger: 'blur' 
		  }
		]
	},
	loading: false,
	msg:'',
});

// 密码验证
const validatePassword = (rule: any, value: string, callback: any) => {
	if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,16}$/g.test(value)) {
		callback()
	} else {
		callback(new Error('请输入包含英文字母大小写、数字和特殊符号的 6-16 位组合'))
	}
}

const onUpload = (data) => {
	state.ruleForm.img = data;
};

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'edit') {
		// 实际请走接口
		getinfo(row.id).then((response: any) => {
			state.ruleForm.email = response.data.email;
			state.ruleForm.name = response.data.name;
			state.ruleForm.phone = response.data.phone;
			state.ruleForm.photo = response.data.photo;
			state.ruleForm.static = response.data.static;
			state.ruleForm.type = response.data.type;
			state.ruleForm.password = response.data.password;
			state.ruleForm.account = response.data.account;
			state.ruleForm.trade_name = response.data.trade_name
			state.ruleForm.email = response.data.email;
			state.ruleForm.province = response.data.province;
			state.ruleForm.address = response.data.address
			getCityCode(response.data)
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
const onUploadvedio = (data) => {
	state.ruleForm.vedio = data;
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
			save(state.ruleForm)
				.then(() => {
					ElMessage.success('保存成功');
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
// 选择地区
const cascaderChange = (e:any) =>{
	state.ruleForm.cascList = e
	getCityIndex(e);
}
const getCityCode = (data:any) => {
	if(data.province!='' || data.city != '' || data.district !=''){
		city.forEach((item:any,index:number) => {
			if(item.name == data.province) {
				state.ruleForm.cascList[0] = item.code
				item.city.forEach((item1:any,index1:number) => {
					if(item1.name == data.city){
						state.ruleForm.cascList[1] = item1.code
						item1.city.forEach((item2:any,index2:number) => {
							if(item2.name == data.district){
								state.ruleForm.cascList[2] = item2.code
							}
						})
					}
				})
			}
		})
	}
	
}
const getCityIndex = (data:any) => {
	city.forEach((item:any,index:number) => {
		if(item.code == data[0]){
			console.log(item,data[0])
			state.ruleForm.province = item.name
			item.city.forEach((item1:any,index1:number)=> {
				if(item1.code == data[1]){
					state.ruleForm.city = item1.name
					item1.city.forEach((item2:any,index2:number) => {
						if(item2.code == data[2]){
							state.ruleForm.district = item2.name
						}
					})
				}
			})
		}
	});
}

// 表单初始化，方法：`resetFields()` 无法使用
const initForm = () => {
	state.ruleForm.email ='';
	state.ruleForm.name = '';
	state.ruleForm.phone = '';
	state.ruleForm.photo = '';
	state.ruleForm.trade_name = '';
	state.ruleForm.account = '';
	state.ruleForm.password = '';
	state.ruleForm.repassword = ''
	state.ruleForm.province = '';
	state.ruleForm.city = '',
	state.ruleForm.address = ''
	state.ruleForm.district = ''
	state.ruleForm.static = 1;
	state.ruleForm.type = 1
	state.cascList = []
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
