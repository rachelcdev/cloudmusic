import {
  CHANGE_HOT_KEYWRODS,
  CHANGE_SUGGEST_LIST,
  CHANGE_RESULT_SONGS_LIST,
  CHANGE_ENTER_LOADING,
} from "./constants";

import { fromJS } from "immutable";
import {
  getHotKeyWordsRequest,
  getSuggestListRequest,
  getResultSongsListRequest,
} from "../../../api/request";

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});
const changeHotKeyWords = (data) => ({
  type: CHANGE_HOT_KEYWRODS,
  data: fromJS(data),
});

const changeSuggestList = (data) => ({
  type: CHANGE_SUGGEST_LIST,
  data: fromJS(data),
});

const changeResultSongs = (data) => ({
  type: CHANGE_RESULT_SONGS_LIST,
  data: fromJS(data),
});

export const getHotKeyWords = () => {
  return (dispatch) => {
    getHotKeyWordsRequest().then((data) => {
      // 拿到关键词列表
      let list = data.result.hots;
      dispatch(changeHotKeyWords(list));
    });
  };
};
export const getSuggestList = (query) => {
  return (dispatch) => {
    getSuggestListRequest(query).then((data) => {
      if (!data) return;
      let res = data.result || [];
      dispatch(changeSuggestList(res));
    });
    getResultSongsListRequest(query).then((data) => {
      if (!data) return;
      let res = data.result.songs || [];
      dispatch(changeResultSongs(res));
      dispatch(changeEnterLoading(false)); // 关闭 loading
    });
  };
};
