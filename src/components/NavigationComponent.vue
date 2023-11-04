<template>
    <nav id="nav-main" class="wrapper-navigation">
        <ol>
            <li v-for="(item, index) in items" :key="index">
                <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
        </ol>
    </nav>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
    data() {
        return {
            items: [
                { name: 'SONGS', path: '/' },
                { name: 'ALBUMS', path: '/albums' },
                { name: 'ABOUT', path: '/about' },
            ]
        }
    },
    components: {
        RouterLink
    }
}

</script>