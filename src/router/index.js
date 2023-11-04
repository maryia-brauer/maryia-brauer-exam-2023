import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js' 
import Login from '@/views/Login.vue' 
import Songs from '@/views/Songs.vue'
import Album from '@/views/Album.vue'
import About from '@/views/About.vue'

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/',
            component: Songs,
        },
        {
            path: '/albums',
            component: Album,
        },
        {
            path: '/about',
            component: About,
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
