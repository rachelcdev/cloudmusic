import React from "react";
import { ListWrapper, ListItem, List } from "./style";
import { getCount } from "../../api/utils";
import LazyLoad from "react-lazyload";
import { withRouter } from "react-router-dom";

function RecommendList(props) {
  const enterDetail = (id) => {
    props.history.push(`/recommend/${id}`);
  };
  return (
    <ListWrapper>
      <h1 className="title">Recommendations</h1>
      <List>
        {props.recommendList.map((list, index) => {
          return (
            <ListItem
              key={`${list.id} ${index}`}
              onClick={() => enterDetail(list.id)}
            >
              <div className="img_wrapper">
                <div className="decorate"></div>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      alt="music"
                      src={require("./music.png")}
                    />
                  }
                >
                  <img
                    src={`${list.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(list.playCount)}</span>
                </div>
              </div>
              <div className="desc"> {list.name}</div>
            </ListItem>
          );
        })}
      </List>
    </ListWrapper>
  );
}

export default React.memo(withRouter(RecommendList));
