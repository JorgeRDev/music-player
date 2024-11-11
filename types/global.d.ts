declare type SongPath = string;

declare interface SongMetadata {
  title: string | undefined;
  frontCover: string | undefined;
  year: number | undefined;
  album: string | undefined;
  artist: string | undefined;
  albumArtist: string | undefined;
  genre: string[] | undefined;
  length: number | undefined;
  itemType: string | undefined;
}
