import { createMemoryHistory, createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/d/:slug+',
        component: () => import('@/pages/CatchAllD.vue'),
        name: 'catch-all-d',
    },
    {
        path: '/',
        component: () => import('@/pages/Home.vue'),
    }
    //to raise bug: delete comment
    /*,
    {
        path: '/tmp',
        component: () => import('@/pages/Tmp.vue'),
    }*/
]


export function buildRouter(isSSR: boolean){
    const history = isSSR ? createMemoryHistory() : createWebHistory();
    const router = createRouter({
        history,
        routes,
    });
    return router;
}