import { Ref, ref } from "vue";
import { SongInfo } from "./songInfo";

const actualSongURL: Ref<SongPath> = ref("");

const musicLibraryPaths: Ref<string[]> = ref([]);
const actualSongInfo: Ref<SongInfo | null> = ref(null);
const actualSongFrontCoverURL: Ref<SongPath> = ref("");
const songsLibrary: Ref<Map<string, SongInfo>> = ref(new Map());
const songsUrlLibrary: Ref<SongPath[]> = ref([]);


export actualSongURL, musicLibraryPaths, actualSongFrontCoverURL, actualSongInfo, actualSongFrontCoverURL;
