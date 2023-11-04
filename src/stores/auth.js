import { defineStore } from 'pinia'
import router from '../router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: {
            name: 'NAME',
            surname: 'SURNAME',
            code: 'IT1234',
            favorite_songs: localStorage.favorite_songs ? JSON.parse(localStorage.favorite_songs) : []
        },
        authenticated: false
    }),
    getters: {
        is_authenticated() {
            return localStorage.is_authenticated ?? this.authenticated;
        },
        getFavoriteSongs() {
            return this.user.favorite_songs;
        }
    },
    actions: {
        setUserData(name, surname, code) {
            this.user.name = name;
            this.user.surname = surname;
            this.user.code = code;
        },
        authenticate(email, password) {
            if (email === 'admin@test.com' && password === '123456') {
                localStorage.is_authenticated = true;
                this.authenticated = true;
                router.push('/');
            }
        },
        logout() {
            localStorage.clear();
            this.authenticated = false;
            router.push('/login');
        },
        toggleFavorite(songID) {
            const index = this.user.favorite_songs.indexOf(songID);
            if (index === -1) {
                this.user.favorite_songs.push(songID);
            } else {
                this.user.favorite_songs.splice(index, 1);
            }
            localStorage.favorite_songs = JSON.stringify(this.user.favorite_songs);
        }
    }
})
