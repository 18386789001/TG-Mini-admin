<template>
	<div class="table-container">
		<el-table
			:data="data"
			:border="setBorder"
			v-bind="$attrs"
			row-key="id"
			default-expand-all
			stripe
			style="width: 100%"
			v-loading="config.loading"
			@selection-change="onSelectionChange"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column type="selection" align="center" :reserve-selection="true" width="30" v-if="config.isSelection" />
			<el-table-column type="index" label="序号" align="center" width="60" v-if="config.isSerialNo" />
			<el-table-column
				v-for="(item, index) in setHeader"
				:key="index"
				show-overflow-tooltip
				:prop="item.key"
				:width="item.colWidth"
				:label="item.title"
				align="center"
			>
				<template v-slot="scope">
					<template v-if="item.type === 'image'">
						<el-image
							v-if="scope.row[item.key]"
							:style="{ width: `40px`, height: `40px` }"
							:src="Url + scope.row[item.key]"
							:zoom-rate="1.2"
							:preview-src-list="[scope.row[item.key]]"
							preview-teleported
							fit="cover"
						/>
					</template>
					<!-- 视频模块 -->
					<template v-else-if="item.type === 'vedio'">
						<video-player
						v-if="scope.row[item.key]"
						:options="options"
							controls
							:muted="false"
							:width="scope.row[item.width]"
							:height="scope.row[item.height]"
							poster="https://univs-news-1256833609.file.myqcloud.com/resource_files/cont_pub/I/AIJOI/J3SLIQIDP5BOND3A2T57W6BTOI.png"  
							:src="Url+ scope.row[item.key]"  
							disablePictureInPicture  
						></video-player>
						<!-- poster 封面 -->
						<!-- disablePictureInPicture //禁用画中画按钮 -->
						<!-- //视频路径 -->
					</template>
					<template v-else-if="item.type == 'text' ">
						{{ scope.row[item.key] }}
					</template>
					<template v-else-if="item.type == 'datetime' ">
						{{ scope.row[item.key] ? parseTime(scope.row[item.key]) : '-' }}
					</template>
					<template v-else-if="item.type == 'radio' ">
						{{ item.dict[scope.row[item.key]] }}
					</template>
					<template v-else-if="item.type == 'select' ">
						{{ state.dictData[item.dict][scope.row[item.key]] }}
					</template>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150" align="center" v-if="config.isOperate">
				<template v-slot="scope">
					<el-button  type="primary" size="small"  v-if="config.approved" @click="passHandel(scope.row)">{{config.approved}}</el-button>
					<el-button  type="danger" size="small"  v-if="config.rejected" @click="turnDownHandel(scope.row)">{{config.rejected}}</el-button>
					<el-button  type="warning" size="small"  v-if="config.isThree" @click="onThreeRow(scope.row)">{{config.isThree}}</el-button>
					<el-button  type="primary" size="small" v-if="config.isUpdate"  @click="onUpdateRow(scope.row)">Amend</el-button>
					<el-popconfirm title="确定删除吗？" @confirm="onDelRow(scope.row)">
						<template #reference>
							<el-button  size="small" type="danger" v-if="config.isDelete" >删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
			<template #empty>
				<el-empty description="暂无数据" />
			</template>
		</el-table>
		<div class="table-footer mt15" v-show="props.showpage">
			<el-pagination
				v-model:current-page="state.page.page"
				v-model:page-size="state.page.size"
				:pager-count="5"
				:page-sizes="[10, 20, 30, 50, 100]"
				:total="config.total"
				layout="total, sizes, prev, pager, next, jumper"
				background
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
			>
			</el-pagination>
			<div class="table-footer-tool">
				<SvgIcon name="iconfont icon-dayin" v-if="config.isPint" :size="19" title="打印" @click="onPrintTable" />
				<SvgIcon name="iconfont icon-yunxiazai_o" :size="22" v-if="config.isDown" title="导出" @click="onImportTable" />
				<SvgIcon name="iconfont icon-shuaxin" :size="22" title="刷新" @click="onRefreshTable" />
				<el-popover
					placement="top-end"
					trigger="click"
					transition="el-zoom-in-top"
					popper-class="table-tool-popper"
					:width="300"
					:persistent="false"
					@show="onSetTable"
				>
					<template #reference>
						<SvgIcon name="iconfont icon-quanjushezhi_o" :size="22" title="设置" />
					</template>
					<template #default>
						<div class="tool-box">
							<el-tooltip content="拖动进行排序" placement="top-start">
								<SvgIcon name="fa fa-question-circle-o" :size="17" class="ml11" color="#909399" />
							</el-tooltip>
							<el-checkbox
								v-model="state.checkListAll"
								:indeterminate="state.checkListIndeterminate"
								class="ml10 mr1"
								label="列显示"
								@change="onCheckAllChange"
							/>
							<el-checkbox v-model="getConfig.isSerialNo" class="ml12 mr1" label="序号" />
							<el-checkbox v-model="getConfig.isSelection" class="ml12 mr1" label="多选" />
						</div>
						<el-scrollbar>
							<div ref="toolSetRef" class="tool-sortable">
								<div class="tool-sortable-item" v-for="v in header" :key="v.key" :data-key="v.key">
									<i class="fa fa-arrows-alt handle cursor-pointer"></i>
									<el-checkbox v-model="v.isCheck" size="default" class="ml12 mr8" :label="v.title" @change="onCheckChange" />
								</div>
							</div>
						</el-scrollbar>
					</template>
				</el-popover>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="netxTable">
import { reactive,watch, computed, nextTick, ref } from 'vue';
import { ElMessage } from 'element-plus';
import printJs from 'print-js';
import table2excel from 'js-table2excel';
import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import '/@/theme/tableTool.scss';
import { auth } from '/@/utils/authFunction';
import { parseTime } from '/@/utils/formatTime';
// 定义父组件传过来的值
const props = defineProps({
	// 列表内容
	data: {
		type: Array<EmptyObjectType>,
		default: () => [],
	},
	// 表头内容
	header: {
		type: Array<EmptyObjectType>,
		default: () => [],
	},
	// 配置项
	config: {
		type: Object,
		default: () => {},
	},
	// 打印标题
	printName: {
		type: String,
		default: () => '',
	},
	// 打印标题
	showpage: {
		type: Number,
		default: () => 1,
	},
	
	// 配置项
	dictData: {
		type: Object,
		default: () => {},
	},
});
const Url = '';
// 定义视频其它配置变量
const options = {
  playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
  autoplay: 'any', // 如果true,浏览器准备好时开始回放。
  muted: true, // 默认情况下将会消除任何音频。
  loop: true, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'zh-CN',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  notSupportedMessage: '暂无法播放', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  controls: true,
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true // 全屏按钮
  }
}

// 定义子组件向父组件传值/事件
const emit = defineEmits(['updateRow','delRow', 'pageChange', 'sortHeader']);

// 定义变量内容
const toolSetRef = ref();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	page: {
		page: 1,
		size: 10,
	},
	selectlist: [] as EmptyObjectType[],
	checkListAll: true,
	checkListIndeterminate: false,
	dictData:props.dictData,
});

// 设置边框显示/隐藏
const setBorder = computed(() => {
	return props.config.isBorder ? true : false;
});
// 获取父组件 配置项（必传）
const getConfig = computed(() => {
	return props.config;
});
// 设置 tool header 数据
const setHeader = computed(() => {
	return props.header.filter((v) => v.isCheck);
});
// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
	if (val) props.header.forEach((v) => (v.isCheck = true));
	else props.header.forEach((v) => (v.isCheck = false));
	state.checkListIndeterminate = false;
};
// tool 列显示当前项改变时
const onCheckChange = () => {
	const headers = props.header.filter((v) => v.isCheck).length;
	state.checkListAll = headers === props.header.length;
	state.checkListIndeterminate = headers > 0 && headers < props.header.length;
};
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
	state.selectlist = val;
};
// 更新当前项
const onUpdateRow = (row: EmptyObjectType) => {
	emit('updateRow', row);
};
// 第三操作
const onThreeRow = (row: EmptyObjectType) => {
	emit('threeRow', row);
};
// 通过
const passHandel = (row: EmptyObjectType) => {
	emit('passClick', row);
};
// 驳回
const turnDownHandel = (row: EmptyObjectType) => {
	emit('turnDown', row);
};
// 删除当前项
const onDelRow = (row: EmptyObjectType) => {
	emit('delRow', row);
};
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.page.size = val;
	emit('pageChange', state.page);
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.page.page = val;
	emit('pageChange', state.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
	state.page.page = 1;
	state.page.size = 10;
	emit('pageChange', state.page);
};
// 打印
const onPrintTable = () => {
	// https://printjs.crabbly.com/#documentation
	// 自定义打印
	let tableTh = '';
	let tableTrTd = '';
	let tableTd: any = {};
	// 表头
	props.header.forEach((v) => {
		tableTh += `<th class="table-th">${v.title}</th>`;
	});
	// 表格内容
	props.data.forEach((val, key) => {
		if (!tableTd[key]) tableTd[key] = [];
		props.header.forEach((v) => {
			if (v.type === 'text') {
				tableTd[key].push(`<td class="table-th table-center">${val[v.key]}</td>`);
			} else if (v.type === 'image') {
				tableTd[key].push(`<td class="table-th table-center"><img src="${val[v.key]}" style="width:${v.width}px;height:${v.height}px;"/></td>`);
			}
		});
		tableTrTd += `<tr>${tableTd[key].join('')}</tr>`;
	});
	// 打印
	printJs({
		printable: `<div style=display:flex;flex-direction:column;text-align:center><h3>${props.printName}</h3></div><table border=1 cellspacing=0><tr>${tableTh}${tableTrTd}</table>`,
		type: 'raw-html',
		css: ['//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css', '//unpkg.com/element-plus/dist/index.css'],
		style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}; .table-th{word-break: break-all;white-space: pre-wrap;}.table-center{text-align: center;}`,
	});
};
// 导出
const onImportTable = () => {
	if (state.selectlist.length <= 0) return ElMessage.warning('请先选择要导出的数据');
	table2excel(props.header, state.selectlist, `${themeConfig.value.globalTitle} ${new Date().toLocaleString()}`);
};
// 刷新
const onRefreshTable = () => {
	emit('pageChange', state.page);
};
// 设置
const onSetTable = () => {
	nextTick(() => {
		const sortable = Sortable.create(toolSetRef.value, {
			handle: '.handle',
			dataIdAttr: 'data-key',
			animation: 150,
			onEnd: () => {
				const headerList: EmptyObjectType[] = [];
				sortable.toArray().forEach((val: string) => {
					props.header.forEach((v) => {
						if (v.key === val) headerList.push({ ...v });
					});
				});
				emit('sortHeader', headerList);
			},
		});
	});
};

watch(
	() => props.dictData,
	(val) => {
		state.dictData = val;
	},
	{
		deep: true,
	}
);

// 暴露变量
defineExpose({
	pageReset,
});
</script>

<style scoped lang="scss">
.table-container {
	display: flex;
	flex-direction: column;
	.el-table {
		flex: 1;
	}
	.table-footer {
		display: flex;
		.table-footer-tool {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			i {
				margin-right: 10px;
				cursor: pointer;
				color: var(--el-text-color-regular);
				&:last-of-type {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
