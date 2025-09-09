import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import DealsTable from '../views/DealsTable.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/main',
            name: 'main',
            component: MainView,
        },
        {
            path: '/table',
            name: 'table',
            component: DealsTable,
        },
    ],
});

export default router;
