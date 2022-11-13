export default interface Playlist {
  checksum: string;
  creation_date: Date;
  id: number;
  link: string;
  md5_image: string;
  nb_tracks: number;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_xl: string;
  public: boolean;
  title: string;
  tracklist: string;
  type: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  tracklist: string;
  type: string;
}
