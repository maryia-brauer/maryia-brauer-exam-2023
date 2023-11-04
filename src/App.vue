<template>
    <Header v-if="is_authenticated"></Header>
    <div id="section-body">
        <NavigationComponent v-if="is_authenticated"></NavigationComponent>
        <router-view class="section-router"></router-view>
    </div>
    <div id="section-player" v-if="is_authenticated">
        <AudioPlayer />
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import NavigationComponent from '@/components/NavigationComponent.vue' 

export default {
    setup() {
        const auth = useAuthStore()
        return { is_authenticated: auth.is_authenticated }
    },
    components: {
        NavigationComponent,

    }
}

</script>
