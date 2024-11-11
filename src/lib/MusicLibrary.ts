import { ref, Ref } from "vue";
import { SongInfo } from "./songInfo";

class MusicLibrary {
  musicLibraryPaths: Ref<string[]> = ref([]);
  songsInfo: Ref<Map<SongPath, SongInfo>> = ref(new Map());

  removeMusicLibraryPath(index: number) {
    this.musicLibraryPaths.value.splice(index, 1);
  }

  addMusicLibraryPath(dir: string) {
    if (dir) {
      this.musicLibraryPaths.value.push(dir);
    }
  }

  getMusicLibraryPaths() {
    return this.musicLibraryPaths.value;
  }

  async createSongsInfoFromPaths() {
    this.clearAll();

    const allSongsPaths = await window.MusicManager.getSongsInfoFromDirectories(
      this.musicLibraryPaths.value
    );

    if (allSongsPaths) {
      this.songsInfo.value = new Map(allSongsPaths);
    }
  }

  getSongsInfo() {
    return this.songsInfo.value;
  }

  clearAll() {
    this.musicLibraryPaths.value = [];
  }
}

export { MusicLibrary };
