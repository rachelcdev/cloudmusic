import { CHANGE_RANK_LIST, CHANGE_ENTER_LOADING } from "./constants";
import { fromJS } from "immutable";

const initailState = fromJS({
  rankList: [],
  enterLoading: true,
});

export default (state = initailState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set("rankList", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);
    default:
      return state;
  }
};
