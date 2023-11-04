<template>
    <div id="login-view">
        <form class="login-form">
            <div class="wrapper-logo">
                <img src="@/assets/logo.svg" />
                <div>KRAKEN.FM</div>
            </div>
            <input id="input-email" v-model="email" placeholder="E-mail" />
            <input id="input-password" v-model="password" type="password" placeholder="Password" />
            <button id="btn-submit" :disabled="!isValid" @click.prevent="login">LOGIN</button>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { ref, computed } from 'vue'

export default {
    setup() {
        const email = ref('')
        const password = ref('')
        const isValid = computed(() => email.value !== '' && password.value.length >= 6)

        const auth = useAuthStore()
        const login = () => {
            if (isValid.value) {
                auth.authenticate(email.value, password.value)
            }
        }

        return { email, password, isValid, login }
    }
}

</script>