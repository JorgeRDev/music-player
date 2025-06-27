<script setup lang="ts">
  import { inject, ref, Ref } from "vue"
  import { SongInfo } from "../../lib/songInfo"
  import { MusicLibrary } from "../../lib/musicLibrary"
  import { watch } from "vue"
  import pino, { Logger } from "pino"
  import { formatSecondsToTimeString } from "../utils/timeFormatting.ts"
  import FrontCover from "../components/ui/FrontCover.vue"
  const logger: Logger<never, boolean> = pino({
    level: "silent",
  })

  const musicLibrary: MusicLibrary = inject(
    "musicLibrary",
    new MusicLibrary()
  )

  const actualSong: Ref<string> = inject(
    "actualSong",
    ref("There is no song")
  )

  const loadAndPlaySong = inject(
    "loadAndPlaySong",
    async (songPath: string) => {}
  )

  const songsLibrary: Ref<Map<string, SongInfo>> =
    inject("songsLibrary", ref(new Map()))

  watch(musicLibrary.songsInfo, (newVal) => {
    logger.info(
      `musicLibrary.getSongsInfo() has changed to ${newVal}`
    )
  })

  function prepareForPlay(
    songPath: string | null
  ) {
    // TODO: create a play button and start to preload the song
  }
</script>

<template>
  <div
    class="h:100% overflow:hidden flex flex:column"
  >
    <div class="view-header">
      <div
        class="top:0 p:0|0|0|0 bg:$(color-background)"
      >
        <h1 class="f:48">Music</h1>
        <!-- TODO: create views for songs, artists, albums, genres, etc -->
        <div
          class="flex gap:1rem place-content:center"
        >
          <p class="f:gray">Songs</p>
          <p class="f:gray">Artists</p>
          <p class="f:gray">Albums</p>
          <p class="f:gray">Genres</p>
        </div>
      </div>
    </div>
    <div
      class="music-library-content overflow-y:scroll overflow-x:hidden bg:$(color-background-soft) r:1rem|0|0|0 p:0 flex-grow:1"
    >
      <div
        class="song-list flex flex:column gap:0.5rem height:100% p:1%|0"
      >
        <div
          class="songItem"
          v-for="[
            songPath,
            songInfo,
          ] in musicLibrary.songsInfo.value.entries()"
        >
          <div
            class="flex place-content:center align-content:center aspect:1/1 w:3rem r:8px bg:#eeeeee overflow:hidden"
            @mouseenter="prepareForPlay(songPath)"
            @click="loadAndPlaySong(songPath)"
            @mouseleave="prepareForPlay(null)"
          >
            <FrontCover
              :front-cover-url="
                songInfo.frontCoverURL
              "
            />
          </div>
          <p class="pl:1rem">
            {{ songInfo.songMetadata?.title }}
          </p>
          <p>
            {{
              songInfo.songMetadata?.artist ??
              "Unknown Artist"
            }}
          </p>
          <p class="hidden block@xs">
            {{
              songInfo.songMetadata?.album ??
              "Unknown Album"
            }}
          </p>
          <p class="hidden block@md">
            {{
              songInfo.songMetadata?.year ??
              "Unknown Year"
            }}
          </p>
          <div
            class="hidden block@md"
            v-for="genre in songInfo.getMetadata()
              ?.genre"
            v-if="
              songInfo.songMetadata?.genre !=
              undefined
            "
          >
            <p>{{ genre }}</p>
          </div>
          <div v-else class="hidden block@md">
            <p>Unknown Genre</p>
          </div>
          <p>
            {{
              formatSecondsToTimeString(
                songInfo.songMetadata?.duration ??
                  0
              )
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .music-library-content {
    scrollbar-width: thin;
  }

  .song-list {
    scrollbar-width: thin;
  }
</style>
