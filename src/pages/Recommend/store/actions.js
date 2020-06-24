import {
  CHANGE_RECOMMEND_LIST,
  CHANGE_BANNER,
  CHANGE_ENTER_LOADING,
} from "./constants";

import { fromJS } from "immutable";
import { getBannerRequst, getRecommendListRequst } from "../../../api/request";

export const changeBannerList = (data) => ({
  type: CHANGE_BANNER,
  data: fromJS(data),
});

export const changeRecommendList = (data) => ({
  type: CHANGE_RECOMMEND_LIST,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});
export const getBannerList = () => (dispatch) => {
  // getBannerRequst()
  getBannerRequst()
    .then((data) => {
      dispatch(changeBannerList(data.banners));
    })
    .catch((err) => {
      console.log({ error: "fail to fetch bannerList " });
    });
};

export const getRecommendList = () => (dispatch) => {
  getRecommendListRequst()
    .then((data) => {
      dispatch(changeRecommendList(data.result));
      dispatch(changeEnterLoading(false));
    })
    .catch((err) => {
      console.log({ error: "fail to fetch recommendList" });
    });
};
