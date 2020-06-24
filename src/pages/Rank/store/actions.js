import { CHANGE_RANK_LIST, CHANGE_ENTER_LOADING } from "./constants";

import { fromJS } from "immutable";
import { getRankListRequest } from "../../../api/request";

const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data),
});
const changeLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});

export const getRankList = () => (dispatch) => {
  getRankListRequest()
    .then((data) => {
      let list = data && data.list;
      dispatch(changeRankList(list));

      dispatch(changeLoading(false));
    })
    .catch((err) => {
      console.log({ error: "Rank List fetched failed" });
    });
};
