import { createRouter, createWebHistory } from 'vue-router';
import RegistrationPage from '../views/RegistrationPage.vue';
import WelcomePage from '../views/WelcomePage.vue';
import DictionaryPage from '../views/DictionaryPage.vue';
import TestsPage from '../views/TestsPage.vue';
import ProfilePage from '../views/ProfilePage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'welcome-page',
            component: WelcomePage,
        },
        {
            path: '/registration',
            name: 'registration',
            component: RegistrationPage
        },
        {
            path: '/dictionary',
            name: 'dictionary',
            component: DictionaryPage
        },
        {
            path: '/tests',
            name: 'tests',
            component: TestsPage
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfilePage
        },
    ]
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/registration'];
    const authRequired = !publicPages.includes(to.path);
    const token = localStorage.getItem('token');

    if (authRequired && !token) {
        return next('/');
    }
    next();
});

export default router;