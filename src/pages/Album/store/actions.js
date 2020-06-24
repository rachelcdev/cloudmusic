import { CHANGE_CURRENT_ALBUM, CHANGE_ENTER_LOADING } from "./constants";

import { fromJS } from "immutable";
import { getAlbumDetailRequest } from "../../../api/request";

export const changeAlbumDetail = (data) => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});
export const getAlbumDetail = (id) => (dispatch) => {
  getAlbumDetailRequest(id)
    .then((data) => {
      let playlist = data.playlist;
      dispatch(changeAlbumDetail(playlist));
      dispatch(changeEnterLoading(false));
    })
    .catch((err) => {
      console.log({ error: "fail to fetch AlbumDetails" });
    });
};
