import {
  CHANGE_SINGER_LIST,
  CHANGE_PAGE_COUNT,
  CHANGE_ENTER_LOADING,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
  CHANGE_CATOGORY,
  CHANGE_ALPHA,
} from "./constants";

import { fromJS } from "immutable";
import {
  getHotSingerListRequest,
  getSingerListRequest,
} from "../../../api/request";

export const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data),
});

export const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data,
});

export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data,
});
export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data,
});
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});

export const getHotSingerList = () => (dispatch) => {
  getHotSingerListRequest(0)
    .then((data) => {
      let artists = data.artists;
      dispatch(changeSingerList(artists));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    })
    .catch((err) => {
      console.log({ error: "hot singers fetched failed" });
    });
};

export const refreshMoreHotSingerList = () => (dispatch, getState) => {
  const pageCount = getState().getIn(["singers", "pageCount"]);
  const singerList = getState().getIn(["singers", "singerList"]).toJS();
  getHotSingerListRequest(pageCount)
    .then((data) => {
      let artists = [...singerList, ...data.artists];
      dispatch(changeSingerList(artists));

      dispatch(changePullUpLoading(false));
    })
    .catch((err) => {
      console.log({ error: "fresh hot singers fetched failed" });
    });
};

export const getSingerList = (category, alpha) => (dispatch) => {
  getSingerListRequest(category, alpha, 0)
    .then((data) => {
      let artists = data.artists;
      dispatch(changeSingerList(artists));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    })
    .catch((err) => {
      console.log({ error: "target singer fetched failed" });
    });
};

export const refreshMoreSingerList = (category, alpha) => (
  dispatch,
  getState
) => {
  const pageCount = getState().getIn(["singers", "pageCount"]);
  const singerList = getState().getIn(["singers", "singerList"]).toJS();
  getSingerListRequest(category, alpha, pageCount)
    .then((data) => {
      let artists = [...singerList, ...data.artists];
      dispatch(changeSingerList(artists));

      dispatch(changePullUpLoading(false));
    })
    .catch((err) => {
      console.log({ error: "fresh target singers fetched failed" });
    });
};
