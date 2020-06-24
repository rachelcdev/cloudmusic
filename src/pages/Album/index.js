import React, {
  useState,
  useRef,
  useEffect,
  Fragment,
  useCallback,
} from "react";
import { Container, TopDesc, Menu, SongItem, SongList } from "./style";
import Header from "../../basicUI/Header";
import MusicNote from "../../basicUI/MusicNote";
import { CSSTransition } from "react-transition-group";
import Scroll from "../../basicUI/Scroll";
import Loading from "../../basicUI/Loading";
import { getCount, getName, isEmptyObject } from "../../api/utils";
import style from "../../styles/global-style";
import { connect } from "react-redux";
import { getAlbumDetail, changeEnterLoading } from "./store/actions";
import SongsList from "../SongsList/index";
function Album(props) {
  const { getAlbumDispatch } = props;
  const { currentAlbum, enterLoading, songsCount } = props;
  const id = props.match.params.id;
  const [showStatus, setShowStatus] = useState(true);
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑马灯
  const [title, setTitle] = useState("歌单");

  const headerEl = useRef();
  const musicNoteRef = useRef();
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const currentAlbumJS = currentAlbum ? currentAlbum.toJS() : null;
  const HEADER_HEIGHT = 45;

  useEffect(() => {
    getAlbumDispatch(id);
  }, [getAlbumDispatch, id]);
  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbumJS]
  );
  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbumJS.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbumJS.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {getCount(currentAlbumJS.subscribedCount)}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbumJS.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbumJS.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbumJS.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };
  const rednerMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        {!isEmptyObject(currentAlbumJS) ? (
          <Fragment>
            <Header
              ref={headerEl}
              title={"return"}
              handleClick={handleBack}
              isMarquee={isMarquee}
              albumName={currentAlbumJS.name}
            ></Header>
            <Scroll bounceTop={false} onScroll={handleScroll}>
              <div>
                {renderTopDesc()}
                {rednerMenu()}
                <SongsList
                  songs={currentAlbumJS.tracks}
                  collectCount={currentAlbumJS.subscribedCount}
                  showCollect={true}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                ></SongsList>
              </div>
            </Scroll>
          </Fragment>
        ) : null}
        {enterLoading ? <Loading /> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(["album", "currentAlbum"]),
  enterLoading: state.getIn(["album", "enterLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});
const mapActionsToProps = (dispatch) => {
  return {
    getAlbumDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumDetail(id));
    },
  };
};

export default connect(mapStateToProps, mapActionsToProps)(React.memo(Album));
