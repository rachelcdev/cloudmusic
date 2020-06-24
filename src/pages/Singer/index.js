import React, { useState, useRef, useCallback, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { getSingerDetail, changeEnterLoading } from "./store/actions";
import { HEADER_HEIGHT, isEmptyObject } from "../../api/utils";
import {
  Container,
  ImgWrapper,
  CollectButton,
  BgLayer,
  SongListWrapper,
} from "./style";
import Header from "../../basicUI/Header";
import Scroll from "../../basicUI/Scroll";
import SongsList from "../SongsList/index";
import Loading from "../../basicUI/Loading";
import MusicNote from "../../basicUI/MusicNote";
function Singer(props) {
  const { getSingerDispatch } = props;
  const { singer, enterLoading, songOfSinger, songsCount } = props;
  const [showStatus, setShowStatus] = useState(true);

  const singerJS = singer ? singer.toJS() : null;
  const songOfSingerJS = songOfSinger ? songOfSinger.toJS() : null;
  const headerEl = useRef();
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);
  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const layer = useRef();
  // 图片初始高度
  const initialHeight = useRef(0);

  // 往上偏移的尺寸，露出圆角
  useEffect(() => {
    const id = props.match.params.id;
    getSingerDispatch(id);
  }, []);
  const OFFSET = 5;
  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
    //eslint-disable-next-line
  }, []);

  const handleScroll = useCallback((pos) => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = headerEl.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      // 按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      // 往上滑动，但是超过 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex = 100;
      // 此时图片高度与 Header 一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, []);
  const musicNoteRef = useRef();

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
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
        {" "}
        <Header
          ref={headerEl}
          title={"return"}
          handleClick={handleBack}
        ></Header>
        {!isEmptyObject(singerJS) ? (
          <ImgWrapper bgUrl={singerJS.picUrl} ref={imageWrapper}>
            <div className="filter"></div>
          </ImgWrapper>
        ) : (
          <ImgWrapper ref={imageWrapper}>
            <div className="filter"></div>
          </ImgWrapper>
        )}
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            {!isEmptyObject(songOfSingerJS) ? (
              <SongsList
                songs={songOfSingerJS}
                showCollect={false}
                musicAnimation={musicAnimation}
              ></SongsList>
            ) : null}
          </Scroll>
        </SongListWrapper>
        {enterLoading ? <Loading /> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  singer: state.getIn(["singerInfo", "singer"]),
  songOfSinger: state.getIn(["singerInfo", "songOfSinger"]),
  enterLoading: state.getIn(["singerInfo", "enterLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getSingerDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerDetail(id));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));
