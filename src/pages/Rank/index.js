import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getRankList } from "./store/actions";
import { renderRoutes } from "react-router-config";
import { filterIndex, filterIdx } from "../../api/utils";
import { List, ListItem, SongList, Container } from "./style";
import LazyLoad from "react-lazyload";
import Scroll from "../../basicUI/Scroll";
import Loading from "../../basicUI/Loading";

function Rank(props) {
  const { rankList, enterLoading } = props;
  const { getRankListDispatch } = props;
  const { route } = props;
  useEffect(() => {
    if (!rankList.length) {
      getRankListDispatch();
    }
  }, []);

  const rankListJS = rankList ? rankList.toJS() : [];
  const globalIndex = filterIndex(rankListJS);
  const officalRank = rankListJS.slice(0, globalIndex);
  const globalRank = rankListJS.slice(globalIndex);

  const enterDetail = (id) => {
    props.history.push(`/rank/${id}`);
  };
  const renderRankList = (list, global) => (
    <List globalRank={global}>
      {list.map((item) => {
        return (
          <ListItem
            key={item.coverImgId}
            tracks={item.tracks}
            onClick={() => enterDetail(item.id)}
          >
            <div className="img_wrapper">
              <LazyLoad
                placeholder={
                  <img
                    src={`require('./music.png)`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                }
              >
                <img
                  src={`${item.coverImgUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </LazyLoad>
              <div className="decorate"></div>
              <span className="update_frequecy">{item.updateFrequency}</span>
            </div>
            {renderSongList(item.tracks)}
          </ListItem>
        );
      })}
    </List>
  );
  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };
  let displayStyle = enterLoading ? { display: "none" } : { display: "" };
  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            {" "}
            Offical Rank{" "}
          </h1>
          {renderRankList(officalRank)}
          <h1 className="global" style={displayStyle}>
            {" "}
            Global Rank{" "}
          </h1>
          {renderRankList(globalRank, true)}
          {enterLoading ? <Loading /> : null}
        </div>
      </Scroll>
      {renderRoutes(route.routes)}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(["rank", "rankList"]),
  enterLoading: state.getIn(["rank", "enterLoading"]),
});
const mapDispatchToProps = (dispatch) => ({
  getRankListDispatch() {
    dispatch(getRankList());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));
