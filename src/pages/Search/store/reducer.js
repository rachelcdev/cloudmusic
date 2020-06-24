import {
  CHANGE_HOT_KEYWRODS,
  CHANGE_SUGGEST_LIST,
  CHANGE_RESULT_SONGS_LIST,
  CHANGE_ENTER_LOADING,
} from "./constants";
import { fromJS } from "immutable";

const initailState = fromJS({
  hotList: [], // 热门关键词列表
  suggestList: [], // 列表，包括歌单和歌手
  songsList: [], // 歌曲列表
  enterLoading: false,
});

export default (state = initailState, action) => {
  switch (action.type) {
    case CHANGE_HOT_KEYWRODS:
      return state.set("hotList", action.data);
    case CHANGE_SUGGEST_LIST:
      return state.set("suggestList", action.data);
    case CHANGE_RESULT_SONGS_LIST:
      return state.set("songsList", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);
    default:
      return state;
  }
};
