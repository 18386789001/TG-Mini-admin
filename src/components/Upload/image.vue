<template>
  <div class="upload-container" style="width: 80%;">
    <el-upload
      :show-file-list="true"
      :action="action"
      :multiple="multiple"
      :name="fileName"
      :accept="accept"
      :limit="limit"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      class="image-uploader"
      list-type="picture-card"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-link type="success"  style="font-size: 10px;" :underline="false">图片格式JPG、PNG ； 大小不超过5M ；{{msg}}</el-link>

    <el-dialog v-model="dialogVisible" destroy-on-close>
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

  </div>
</template>

<script lang="ts" setup name="SingleImageUpload">
import { reactive,computed,ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import {  ElMessage } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['upload']);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
// 定义父组件传过来的值
const props = defineProps({
	// 列表内容
	value: {
		type: String,
		default: () => '',
	},
  //文件名称
  fileName: {
		type: String,
		default: () => 'file',
	},
  //文件数量限制
  limit: {
		type: Number,
		default: () => 10,
	},

  //是否多选
  multiple: {
		type: Boolean,
		default: () => true,
	},
  //可选类型
  accept: {
		type: String,
		default: () => 'image/*',
	},
  //上传地址
  action: {
		type: String,
		default: () => import.meta.env.VITE_API_URL + '/upload/file',
	},
  //展示信息
  msg: {
		type: String,
		default: () => '',
	},
});

const fileList = computed(() => {
  const imgarr = []
  if (props.value === '') {
    return [];
  }
  if (props.value != '') {
    const arr = props.value.split(',');
    for (let i = 0; i < arr.length; i++) {
      imgarr.push({ url: arr[i] });
    }
  }    
  return imgarr;
});


const handleRemove = (file, fileList) => {
  if (fileList.length > 0) {
    const urls = fileList.map( item => { return item.url});
    emit('upload', urls.join(','));
  } else {
    emit('upload', '');
  }
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
const handleExceed = (files, fileList) => {
  ElMessage.error('最多上传' + props.limit + '张图片');
};

const  beforeUpload = (file) => {
  const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isIMG) {
    ElMessage.error('上传图片只能是 JPG、PNG 格式!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!');
    return false;
  }
  return isIMG && isLt5M;
};

const onProgress = (event, file, fileList) => {

};

const handleSuccess = (res, file, fileList)=> {

      if (res.status === 1) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i]['uid'] === file['uid']) {
            fileList[i]['url'] = res.data.path;
            break;
          }
        }
        const urls = [];
        if (fileList.every(item => item.status == 'success')) {
          fileList.map(item => {
            urls.push(item.url);
          });
          emit('upload', urls.join(','));
        }

      } else {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i]['uid'] === file['uid']) {
            fileList.splice(i, 1);
            break;
          }
        }
        ElMessage.error(res.msg);
      }
    };

const  handleError = (err, file, fileList) =>{
  ElMessage.error(err);
};


</script>
<style rel="stylesheet/scss" lang="scss">
	.image-uploader {
    height: 80px;
    overflow: hidden;
		.el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
			width: 80px;
			height: 80px;
			.el-upload-dragger{
				height: 100%;
			}
			&:hover{
				border-color: #409EFF;
			}
		}
		.el-upload-list__item{
			width: 80px;
			height: 80px;
		}
		.image {
			width: 80px;
			height: 80px;
			display: block;
		}
		.el-upload--picture-card {
			font-size: 28px;
			color: #8c939d;
			width: 80px;
			height: 80px;
      line-height:85px;
			text-align: center;
		}

	}
</style>
