import {
  CHANGE_SINGER_DETAIL,
  CHANGE_SONGS_OF_SINGER,
  CHANGE_ENTER_LOADING,
} from "./constants";

import { fromJS } from "immutable";
import { getSingerDetailRequest } from "../../../api/request";

export const changeSingerDetail = (data) => ({
  type: CHANGE_SINGER_DETAIL,
  data: fromJS(data),
});
export const changeSongs = (data) => ({
  type: CHANGE_SONGS_OF_SINGER,
  data: fromJS(data),
});
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});

export const getSingerDetail = (id) => (dispatch) => {
  getSingerDetailRequest(id)
    .then((data) => {
      let artist = data.artist;
      let songs = data.hotSongs;
      dispatch(changeSingerDetail(artist));
      dispatch(changeSongs(songs));
      dispatch(changeEnterLoading(false));
    })
    .catch((err) => {
      console.log({ error: "singer details fetched failed" });
    });
};
