<template>
  <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
      <h1>SONGS</h1>
      <div class="wrapper-search">
        <input id="input-search" placeholder="Search by title..." v-model="search" />
      </div>
      <div class="wrapper-settings">
        <button id="btn-show-favorites" :class="{ active: showFavorites }" @click="toggleShowFavorites">Show Favorites</button>
      </div>
    </div>
    <div class="wrapper-songs">
      <table cellspacing="0" cellpadding="0">
        <tr ref="header">
            <th id="th-id">#</th>
            <th id="th-title" @click="sortBy('title')" :class="{ active: isSortActive('title') }">
                Title
                <IconCaretUp v-if="isSortActive('title')" color="var(--c-accent-secondary)"
                    :class="{ 'flip-vertical': isSortDesc() }" />
            </th>
            <th id="th-artist">Artist</th>
            <th id="th-album">Album</th>
            <th id="th-duration" @click="sortBy('duration')" :class="{ active: isSortActive('duration') }">
                Duration
                <IconCaretUp v-if="isSortActive('duration')" color="var(--c-accent-secondary)"
                    :class="{ 'flip-vertical': isSortDesc() }" />
            </th>
        </tr>
        <tr class="song" v-for="(song, index) in filteredSongs" :key="song.id" @click="selectSong(song)" @mouseover="hoveredSongIndex = index" @mouseout="hoveredSongIndex = -1" :class="{ active: isSongActive(song) }">
          <td id="td-index">
            <IconPlay v-if="isNowPlaying(song)" color="var(--c-accent-secondary)" />
            <span id="txt-index" v-else>{{ index + 1 }}</span>
          </td>
          <td id="td-title">
            <img :src="song.album.images[1].url" />
            {{ song.name }}
          </td>
          <td id="td-artist">{{ getArtists(song.artists) }}</td>
          <td id="td-album">{{ song.album.name }}</td>
          <td id="td-duration">
            {{ getTime(song.duration_ms) }}
            <IconHeart :class="{ active: isSongFavorite(song) || isSongHovered(index) }" @click="auth.toggleFavorite(song.id)" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { usePlayerStore } from '@/stores/player.js';
import songsAPI from '@/data/songs.js';
import IconPlay from '@/components/icons/IconPlay.vue';
import IconCaretUp from '@/components/icons/IconCaretUp.vue';
import IconHeart from '@/components/icons/IconHeart.vue';

export default {
  components: { IconPlay, IconCaretUp, IconHeart },
  data() {
    const store = usePlayerStore();
    const auth = useAuthStore();
    return {
      hoveredSongIndex: -1,
      store,
      auth,
      songs: [...songsAPI],
      sort: {
        by: null,
        order: 'asc',
      },
      search: '',
      clicks: 0,
      showFavorites: false,
    };
  },
  methods: {
    getTime(time_in_ms) {
      const min = Math.floor((time_in_ms / 1000 / 60) << 0);
      const sec = Math.floor((time_in_ms / 1000) % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    },
    getArtists(artists) {
      return artists.map((artist) => artist.name).join(', ');
    },
    handleScroll(event) {
      this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
    },
    sortBy(by) {
      if (by === this.sort.by) {
        this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc';
        this.sort.by = this.sort.order === 'asc' ? null : this.sort.by;
      } else {
        this.sort.by = by;
      }
      switch (this.sort.by) {
        case 'title':
          this.songs.sort((a, b) => (this.sort.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
          break;
        case 'duration':
          this.songs.sort((a, b) => (this.sort.order === 'asc' ? a.duration_ms - b.duration_ms : b.duration_ms - a.duration_ms));
          break;
        default:
          this.songs = [...songsAPI];
          break;
      }
    },
    selectSong(song) {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0;
        }, 500);
      } else {
        clearTimeout(this.timer);
        this.store.setNowPlaying(song);
        this.clicks = 0;
      }
    },
    toggleShowFavorites() {
      this.showFavorites = !this.showFavorites;
    },
    isSortActive(by) {
      return this.sort.by === by;
    },
    isSortDesc() {
      return this.sort.order === 'desc';
    },
    isSongActive(song) {
      return this.store.getNowPlayingSongId === song.id;
    },
    isNowPlaying(song) {
      return this.store.getNowPlayingSongId === song.id;
    },
    isSongFavorite(song) {
      return this.auth.getFavoriteSongs.includes(song.id) || this.isSongHovered(song);
    },
    isSongHovered(index) {
      return this.hoveredSongIndex === index;
    },
  },
  mounted() {
    this.store.setPlaylist(this.songs);
  },
  computed: {
    filteredSongs() {
      const filteredSongs = this.songs.filter((song) => {
        return (
          song.name.toLowerCase().includes(this.search.toLowerCase()) &&
          (this.showFavorites ? this.auth.getFavoriteSongs.includes(song.id) : true)
        );
      });

      const uniqueSongs = new Map();
      filteredSongs.forEach((song) => {
        if (!uniqueSongs.has(song.id)) {
          uniqueSongs.set(song.id, song);
        }
      });

      return Array.from(uniqueSongs.values());
    },
  },
};
</script>
