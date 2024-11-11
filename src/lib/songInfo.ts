import { base64ToUint8Array, uint8ArrayToBase64 } from "uint8array-extras";

class SongInfo {
  songPath: SongPath;
  private buffer: Buffer | undefined;
  private blob: Blob | undefined;
  private url: string | undefined;
  private songMetadata: SongMetadata | undefined;
  private frontCoverURL: string | undefined;
  private frontCoverBlob: Blob | undefined;
  constructor(songPath: SongPath) {
    console.log(`SongInfo() has been created with ${songPath}`);

    this.songPath = songPath;
  }

  async setBuffer() {
    const _buffer: Buffer | undefined = await window.MusicManager.getSong(
      this.songPath
    );

    if (_buffer != undefined) {
      this.buffer = _buffer;
    } else {
      throw new Error("Buffer is undefined");
    }
  }

  setBlob(blob: Blob) {
    this.blob = blob;
  }

  setURL(url: string) {
    this.url = url;
  }

  getBuffer() {
    return this.buffer;
  }

  getBlob() {
    return this.blob;
  }

  getURL() {
    return this.url;
  }

  createBlobFromBuffer() {
    if (this.buffer != undefined) {
      this.blob = new Blob([this.buffer]);
    } else {
      throw new Error("Buffer is undefined");
    }
  }

  createURLFromBlob() {
    if (this.blob != undefined) {
      this.url = URL.createObjectURL(this.blob);
    } else {
      throw new Error("Blob is undefined");
    }
  }

  async createMetadataFromBuffer() {
    if (this.buffer != undefined) {
      this.songMetadata = await window.MusicManager.getSongInfo(this.buffer);
    } else {
      throw new Error("Buffer is undefined");
    }
  }

  createFrontCoverURL() {
    if (this.songMetadata != undefined) {
      if (this.songMetadata.frontCover != undefined) {
        this.frontCoverBlob = new Blob([
          base64ToUint8Array(this.songMetadata.frontCover),
        ]);
        this.frontCoverURL = URL.createObjectURL(this.frontCoverBlob);
      } else {
        throw new Error("Front cover is undefined");
      }
    } else {
      throw new Error("Song metadata is undefined");
    }
  }

  getMetadata() {
    return this.songMetadata;
  }

  getFrontCoverURL() {
    return this.frontCoverURL;
  }

  clearAll() {
    this.buffer = undefined;
    this.blob = undefined;
    if (this.url != undefined) {
      URL.revokeObjectURL(this.url);
      this.url = undefined;
    }
  }
}

export { SongInfo };
