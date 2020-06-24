import { server } from "./config";

export const getBannerRequst = () => {
  return server.get("/banner");
};

export const getRecommendListRequst = () => {
  return server.get("/personalized");
};
export const getHotSingerListRequest = (count) => {
  return server.get(`/top/artists?offset=${count}`);
};

export const getSingerListRequest = (category, alpha, count) => {
  return server.get(
    `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};
export const getRankListRequest = () => {
  return server.get(`/toplist/detail`);
};
export const getAlbumDetailRequest = (id) => {
  return server.get(`/playlist/detail?id=${id}`);
};
export const getSingerDetailRequest = (id) => {
  return server.get(`/artists?id=${id}`);
};
export const getLyricRequest = (id) => {
  return server.get(`/lyric?id=${id}`);
};
export const getHotKeyWordsRequest = () => {
  return server.get(`/search/hot`);
};

export const getSuggestListRequest = (query) => {
  return server.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = (query) => {
  return server.get(`/search?keywords=${query}`);
};
export const getSongDetailRequest = (id) => {
  return server.get(`/song/detail?ids=${id}`);
};
