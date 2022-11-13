import Album from './Album';
import Artist from './Artist';

export default interface Track {
  checksum: string;
  album: Album;
  artist: Artist;
  duration: number;
  explicit_content_cover: number;
  explicit_content_lyrics: number;
  explicit_lyrics: boolean;
  id: number;
  link: string;
  md5_image: string;
  preview: string;
  rank: number;
  readable: boolean;
  time_add: Date;
  title: string;
  title_short: string;
  type: string;
}
