import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js' 
import Login from '@/views/Login.vue' 

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path: '/login',
            component: Login,
        },

    ]
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.path !== '/login' && !auth.is_authenticated) {
        next('/login')
    }
    else if (to.path === '/login' && auth.is_authenticated) {
        next('/')
    }
    else {
        next()
    }
})

export default router
