const menu  = [
    {
        path: '/',
		name: '/',
		component: () => import('/@/views/taskList/index.vue'),
        redirect: '/home',
        meta: {
            isKeepAlive: true,
        },
        children: []
    },
    {
        path:'/taskList',
        name: 'taskList',
        // component: () => import('@/views/taskList/index.vue'),
        title:'dasdada '
    }
]

export default menu