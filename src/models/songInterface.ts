declare type SongPath = string

declare interface ISong {
    songPath: SongPath | undefined
    buffer: Buffer | undefined
    blob: Blob | undefined
    url: string | undefined
    songMetadata: ISongMetadata | undefined
    totalDuration: number | undefined
    frontCoverBlob: Blob | undefined
    frontCoverURL: string | undefined

    createBuffer(): Promise<Buffer>
    createBlobFromBuffer(): void
    createURLFromBlob(): void
    getMetadataFromSongPath(options?: { compressImage: boolean }): void
    createFrontCoverBlob(): void
    createFrontCoverURL(): void
    getURL(): string | undefined
    getFrontCoverURL(): string | undefined
    getMetadata(): ISongMetadata | undefined
    getTotalDuration(): number | undefined
    setTotalDuration(totalDuration: number): void
    disposeBlobAndBuffer(): void
    disposeAll(): void
}

declare interface IActualSong extends ISong {
    song: Howl | undefined
    actualDuration: number | undefined
    lyrics: ISongLyric[] | undefined
    userChangedDuration: boolean | undefined
}

export type {SongPath}
export {ISong}