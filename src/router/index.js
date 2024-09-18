import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'login',
                    component: () => import('@/views/Auth/index.vue')
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/create-transaction',
                    name: 'CreateTransaction',
                    component: () => import('@/views/CreateTransaction/index.vue')
                },
                {
                    path: '/criterias',
                    name: 'Criterias',
                    component: () => import('@/views/Criterias/index.vue')
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: () => import('@/views/Users/index.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/transactions',
                    name: 'transactions',
                    component: () => import('@/views/Transactions/index.vue')
                }
                // {
                //     path: '/uikit/input',
                //     name: 'input',
                //     component: () => import('@/views/uikit/InputDoc.vue')
                // },
                // {
                //     path: '/uikit/button',
                //     name: 'button',
                //     component: () => import('@/views/uikit/ButtonDoc.vue')
                // },

                // {
                //     path: '/uikit/list',
                //     name: 'list',
                //     component: () => import('@/views/uikit/ListDoc.vue')
                // },
                // {
                //     path: '/uikit/tree',
                //     name: 'tree',
                //     component: () => import('@/views/uikit/TreeDoc.vue')
                // },
                // {
                //     path: '/uikit/panel',
                //     name: 'panel',
                //     component: () => import('@/views/uikit/PanelsDoc.vue')
                // },

                // {
                //     path: '/uikit/overlay',
                //     name: 'overlay',
                //     component: () => import('@/views/uikit/OverlayDoc.vue')
                // },
                // {
                //     path: '/uikit/media',
                //     name: 'media',
                //     component: () => import('@/views/uikit/MediaDoc.vue')
                // },
                // {
                //     path: '/uikit/message',
                //     name: 'message',
                //     component: () => import('@/views/uikit/MessagesDoc.vue')
                // },
                // {
                //     path: '/uikit/file',
                //     name: 'file',
                //     component: () => import('@/views/uikit/FileDoc.vue')
                // },
                // {
                //     path: '/uikit/menu',
                //     name: 'menu',
                //     component: () => import('@/views/uikit/MenuDoc.vue')
                // },
                // {
                //     path: '/uikit/charts',
                //     name: 'charts',
                //     component: () => import('@/views/uikit/ChartDoc.vue')
                // },
                // {
                //     path: '/uikit/misc',
                //     name: 'misc',
                //     component: () => import('@/views/uikit/MiscDoc.vue')
                // },
                // {
                //     path: '/uikit/timeline',
                //     name: 'timeline',
                //     component: () => import('@/views/uikit/TimelineDoc.vue')
                // },
                // {
                //     path: '/pages/empty',
                //     name: 'empty',
                //     component: () => import('@/views/pages/Empty.vue')
                // },
                // {
                //     path: '/pages/crud',
                //     name: 'crud',
                //     component: () => import('@/views/pages/Crud.vue')
                // },
                // {
                //     path: '/documentation',
                //     name: 'documentation',
                //     component: () => import('@/views/pages/Documentation.vue')
                // }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Login.vue')
        // },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const item = localStorage.getItem('user');
    const routes = router.getRoutes();

    if (item) {
        if (to.fullPath == '/') {
            next({ name: 'dashboard' });
            return;
        }
        if (!to.name || to.name == 'notfound') {
            document.body.classList.remove('preparing-content');
            if (!to.name) next({ name: 'notfound' });
            next();
            return;
        }
        next();
        return;
    }
    if (to.fullPath != '/') {
        next({ name: 'login' });
    }
    next();
});
export default router;
