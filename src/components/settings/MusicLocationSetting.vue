<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue";
import type { MusicLibrary } from "../../lib/musicLibrary";

const musicLibrary: MusicLibrary = inject("musicLibrary") as MusicLibrary;

const chooseDirectories = async () => {
  console.log(`executing chooseDirectories()`);

  console.log(`user is choosing directories`);

  const directories: string[] | null =
    await window.FileSystem.chooseDirectories();

  console.log(`chooseDirectories() has received ${directories}`);

  if (directories) {
    console.log(`adding directories to musicLibrary`);
    for (const directory of directories) {
      console.log(`${directory} is being added`);
      musicLibrary.addMusicLibraryPath(directory);
      console.log(`${directory} has been added`);
    }

    console.log(
      `musicLibraryPaths has ${musicLibrary.getMusicLibraryPaths().length} directories`
    );
    console.log(`musicLibraryPaths has ${musicLibrary.getMusicLibraryPaths()}`);
  }

  await musicLibrary.createSongsPathFromPaths();
  await musicLibrary.createSongsInfoFromPaths();
};
</script>

<template>
  <div class="setting">
    <div class="flex">
      <p>Music locations</p>
      <button @click="chooseDirectories()">Add folder</button>
    </div>
    <div class="flex flex-direction:column">
      <div
        v-if="musicLibrary.getMusicLibraryPaths().length > 0"
        v-for="(musicLibraryPath, index) in musicLibrary.getMusicLibraryPaths()"
        :key="index"
        class="b"
      >
        <p>{{ index }}</p>
        <p>{{ musicLibraryPath }}</p>
        <button @click="musicLibrary.removeMusicLibraryPath(index)">
          Remove Library
        </button>
      </div>
    </div>
  </div>
</template>
