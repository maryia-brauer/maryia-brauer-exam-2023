<template>
  <div id="about-view">
    <div class="wrapper-header">
      <h1>ABOUT ME</h1>
      <div class="settings">
        <button id="btn-edit" :class="{ active: editForm }" @click="toggleEditForm">{{ editForm ? 'Cancel' : 'Edit Form' }}</button>
        <button id="btn-save" v-if="editForm" class="submit" @click="saveForm">Save Form</button>
      </div>
    </div>
    <form>
      <div class="wrapper-input" v-for="field in formFields" :key="field.label">
        <label>{{ field.label }}</label>
        <input v-if="editForm" :id="field.inputId" v-model="userForm[field.model]" />
        <p :id="field.textId" v-else>{{ getUserField(field.model) }}</p>
      </div>
      <div class="wrapper-songs">
        <label>FAVORITE SONGS</label>
        <ul v-if="favoriteSongs.length > 0">
          <li v-for="song in favoriteSongs" :key="song.id">
            <img id="img-album" :src="song.album.images[1].url" />
            <div class="song-info">
              <p id="txt-song" class="song-name">{{ song.name }}</p>
              <p id="txt-artist" class="song-artists">{{ getArtists(song.artists) }}</p>
            </div>
          </li>
        </ul>
        <div id="txt-empty" v-else class="empty">NO SONGS FOUND</div>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import songsAPI from '@/data/songs';
import IconEdit from '@/components/icons/IconEdit.vue';

export default {
  components: { IconEdit },
  data() {
    const auth = useAuthStore();
    return {
      auth,
      editForm: false,
      userForm: {
        name: auth.user.name,
        surname: auth.user.surname,
        code: auth.user.code,
      },
      formFields: [
        {
          label: 'NAME',
          model: 'name',
          inputId: 'input-name',
          textId: 'txt-name',
        },
        {
          label: 'SURNAME',
          model: 'surname',
          inputId: 'input-surname',
          textId: 'txt-surname',
        },
        {
          label: 'STUDENT CODE',
          model: 'code',
          inputId: 'input-code',
          textId: 'txt-code',
        },
      ],
    };
  },
  methods: {
    getArtists(artists) {
      return artists.map((artist) => artist.name).join(', ');
    },
    toggleEditForm() {
      this.editForm = !this.editForm;
    },
    saveForm() {
      this.auth.setUserData(this.userForm.name, this.userForm.surname, this.userForm.code);
      this.editForm = false;
    },
    getUserField(fieldName) {
      return this.auth.user[fieldName].toUpperCase();
    },
  },
  computed: {
    favoriteSongs() {
      return this.auth.getFavoriteSongs.map((songID) => {
        return songsAPI.find((song) => song.id === songID);
      });
    },
  },
};
</script>
