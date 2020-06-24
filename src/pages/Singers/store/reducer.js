import {
  CHANGE_SINGER_LIST,
  CHANGE_PAGE_COUNT,
  CHANGE_ENTER_LOADING,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
} from "./constants";
import { fromJS } from "immutable";
import { actions } from "../../Recommend/store";

const initailState = fromJS({
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  pageCount: 0,
});

export default (state = initailState, action) => {
  switch (action.type) {
    case CHANGE_SINGER_LIST:
      return state.set("singerList", action.data);
    case CHANGE_PAGE_COUNT:
      return state.set("pageCount", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);
    case CHANGE_PULLDOWN_LOADING:
      return state.set("pullDownLoading", action.data);
    case CHANGE_PULLUP_LOADING:
      return state.set("pullUpLoading", action.data);
    default:
      return state;
  }
};
