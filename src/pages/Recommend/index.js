import React, { useEffect } from "react";
import Slider from "../../components/slider/Slider";
import RecommendList from "../../components/recommendList/RecommendList";
import Scroll from "../../basicUI/Scroll";
import { forceCheck } from "react-lazyload";
import { Content } from "./style";
import { getBannerList, getRecommendList } from "./store/actions";
import { connect } from "react-redux";
import PropType from "prop-types";
import Loading from "../../basicUI/Loading";
import { renderRoutes } from "react-router-config";
function Recommend(props) {
  const { bannerList, recommendList, enterLoading, songsCount } = props;
  const { getRecommendList, getBannerList } = props;
  const { route } = props;
  useEffect(() => {
    if (!bannerList.size) {
      getBannerList();
    }
    if (!recommendList.size) {
      getRecommendList();
    }
  });
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading ? <Loading /> : null}
      {renderRoutes(route.routes)}
    </Content>
  );
}

const mapStateToProps = (state) => ({
  bannerList: state.getIn(["recommend", "bannerList"]),
  recommendList: state.getIn(["recommend", "recommendList"]),
  enterLoading: state.getIn(["recommend", "enterLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});
const mapActionsToProps = {
  getRecommendList,
  getBannerList,
};
Recommend.propType = {
  getBannerList: PropType.func,
  getRecommendList: PropType.func,
  bannerList: PropType.object,
  recommendList: PropType.object,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(React.memo(Recommend));
