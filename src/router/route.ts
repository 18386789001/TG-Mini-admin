import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      permission：    权限标识
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		permission?: string[];
		icon?: string;
	}
}

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('/@/views/taskList/index.vue'),
				meta: {
					// 任务列表
					title: 'TASK LIST',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					permission:[],
					icon: 'iconfont icon-shouye',
				},
			},
			//任务管理
			{
				path: '/taskManagment',
				name: 'taskManagment',
				component: () => import('/@/views/taskManagment/index.vue'),
				meta: {
					title: 'TASK MANAGEMENT',
					icon: 'iconfont icon-shouye',
				},
			},
			//用户管理
			{
				path: '/material',
				name: 'material',
				component: () => import('/@/views/material/tag/index.vue'),
				meta: {
					title: 'USER MANAGEMENT',
					icon: 'iconfont icon-shouye',
				},
			},
			//审核管理
			{
				path: '/auditManagement',
				name: 'auditManagement',
				component: () => import('/@/views/auditManagement/index.vue'),
				meta: {
					title: 'AUDIT MANAGEMENT',
					icon: 'iconfont icon-shouye',
				},
			},
			// 审核列表
			{
				path: '/auditList',
				name: 'auditList',
				component: () => import('/@/views/auditList/index.vue'),
				meta: {
					title: 'AUDIT LIST',
					icon: 'iconfont icon-shouye',
				},
			},
			// 用户钱包
			{
				path: '/userWallet',
				name: 'userWallet',
				component: () => import('/@/views/userWallet/index.vue'),
				meta: {
					title: 'USER WALLET',
					icon: 'iconfont icon-shouye',
				},
			},
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
	{
		path: '/personal',
		name: 'personal',
		component: () => import('/@/views/personal/index.vue'),
		meta: {
			title: 'message.router.personal',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
];
