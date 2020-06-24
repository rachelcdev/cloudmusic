import React, { useState, useEffect, Fragment } from "react";
import LazyLoad, { forceCheck } from "react-lazyload";
import HorizonItem from "../../basicUI/HorizonItem";
import { categoryTypes, alphaTypes } from "../../api/config";
import { NavContainer, List, ListItem, ListContainer } from "./style";
import Scroll from "../../basicUI/Scroll";
import Loading from "../../basicUI/Loading";
import {
  changeEnterLoading,
  changePageCount,
  changePullUpLoading,
  changePullDownLoading,
  getHotSingerList,
  refreshMoreHotSingerList,
  getSingerList,
  refreshMoreSingerList,
} from "./store/actions";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
function Singers(props) {
  let [category, setCategory] = useState("");
  let [alpha, setAlpha] = useState("");
  const { route } = props;

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`);
  };
  const {
    singerList,
    pageCount,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    songsCount,
  } = props;
  const {
    updateSingerDispatch,
    getHotSingerDispatch,
    pullDownRefreshDispatch,
    pullUpRefreshDispatch,
  } = props;
  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch();
    }
  }, []);
  let handleUpdateAlpha = (val) => {
    setAlpha(val);
    updateSingerDispatch(categoryTypes, val);
  };

  let handleUpdateCategory = (val) => {
    setCategory(val);
    updateSingerDispatch(val, alpha);
  };
  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === "", pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  const singerListJS = singerList ? singerList.toJS() : [];

  const renderSingerList = () => {
    return (
      <List>
        {singerListJS.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      src={`require('./singer.png)`}
                      width="100%"
                      height="100%"
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <HorizonItem
          list={categoryTypes}
          title={"default"}
          oldVal={category}
          handleClick={(val) => handleUpdateCategory(val)}
        ></HorizonItem>
        <HorizonItem
          list={alphaTypes}
          title={"Alpha"}
          oldVal={alpha}
          handleClick={(val) => handleUpdateAlpha(val)}
        ></HorizonItem>
      </NavContainer>
      <ListContainer play={songsCount}>
        <Scroll
          onScroll={forceCheck}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        {enterLoading ? <Loading /> : null}
      </ListContainer>
      {renderRoutes(route.routes)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(["singers", "singerList"]),
  pageCount: state.getIn(["singers", "pageCount"]),
  enterLoading: state.getIn(["singers", "enterLoading"]),
  pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
  pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateSingerDispatch(category, alpha) {
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList(category, alpha));
    },
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count + 1));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha));
      }
    },
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));
      if (category === "" && alpha === "") {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singers));
