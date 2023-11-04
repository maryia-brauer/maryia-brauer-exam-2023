<template>
  <div id="album-view">
    <div class="wrapper-header">
      <h1>ALBUMS</h1>
      <div class="settings">
        <button id="btn-grid" :class="{ active: isGrid }" @click="toggleView('grid')">
          <IconGrid />
        </button>
        <button id="btn-list" :class="{ active: !isGrid }" @click="toggleView('list')">
          <IconList />
        </button>
      </div>
    </div>
    <ul id="list-albums" :class="{ grid: isGrid }">
      <li class="album" v-for="album in albums" :key="album.id" @click="selectAlbum(album)">
        <img id="img-album" :src="album.images[0].url" />
        <div class="album-info">
          <h4 class="txt-album-name">{{ album.name }}</h4>
          <p class="txt-album-artists">{{ getAlbumArtists(album.artists) }}</p>
          <div class="album-year">
            <p id="txt-album-year">{{ getAlbumYear(album.release_date) }}</p>
            <p id="txt-album-tracks">{{ getTracksDescription(album.tracks.length) }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import songsAPI from '@/data/songs'
import IconGrid from '@/components/icons/IconGrid.vue'
import IconList from '@/components/icons/IconList.vue'
import { usePlayerStore } from '@/stores/player';

export default {
  components: { IconGrid, IconList },
  data() {
    const store = usePlayerStore();
    return {
      store,
      isGrid: true,
      clicks: 0
    }
  },
  methods: {
    getAlbumArtists(artists) {
      return artists.map(artist => artist.name).join(', ');
    },
    getAlbumYear(date) {
      const releaseDate = new Date(date);
      return releaseDate.getFullYear();
    },
    getTracksDescription(trackCount) {
      return `${trackCount} song${trackCount > 1 ? 's' : ''}`;
    },
    toggleView(view) {
      this.isGrid = view === 'grid';
    },
    selectAlbum(album) {
      this.clicks++;
      if (this.clicks === 1) {
        setTimeout(() => {
          this.clicks = 0;
        }, 500);
      } else {
        clearTimeout(this.timer);
        this.store.setPlaylist(album.tracks);
        this.store.setNowPlaying(album.tracks[0]);
        this.clicks = 0;
      }
    }
  },
  computed: {
    albums() {
      const albumMap = songsAPI.reduce((accumulator, currentSong) => {
        const albumID = currentSong.album.id;
        accumulator[albumID] = accumulator[albumID] || {
          ...currentSong.album,
          tracks: []
        };
        accumulator[albumID].tracks.push(currentSong);
        return accumulator;
      }, {});
      return Object.values(albumMap);
    }
  }
}
</script>
