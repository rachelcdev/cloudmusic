import React, { useState, useEffect, useCallback, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import {
  Container,
  ShortcutWrapper,
  HotKey,
  List,
  ListItem,
  SongItem,
} from "./style";
import MusicalNote from "../../basicUI/MusicNote";
import SearchBox from "../../basicUI/SearchBox";
import Scroll from "../../basicUI/Scroll";
import Loading from "../../basicUI/Loading";
import { connect } from "react-redux";
import LazyLoad, { forceCheck } from "react-lazyload";
import { getName } from "../../api/utils";
import {
  getSuggestList,
  getHotKeyWords,
  changeEnterLoading,
} from "./store/actions";
import { getSongDetail } from "../Player/store/actions";
function Search(props) {
  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch,
  } = props;
  const { hotList, suggestList, songsList, enterLoading, songsCount } = props;
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const suggestListJS = suggestList ? suggestList.toJS() : null;
  const songsListJS = songsList ? songsList.toJS() : null;
  const musicNoteRef = useRef();
  useEffect(() => {
    setShow(true);
    if (!hotList.size) {
      getHotKeyWordsDispatch();
    }
  }, []);
  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
    if (!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };
  const renderSingers = () => {
    let singers = suggestListJS.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => props.history.push(`/singers/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("../Singers/singer.png")}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderAlbum = () => {
    let albums = suggestListJS.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌单 </h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => props.history.push(`/album/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("../../components/recommendList/music.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    });
  };
  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: "20px" }}>
        {songsListJS.map((item) => {
          return (
            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title"> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScorll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {enterLoading ? <Loading></Loading> : null}
        <MusicalNote ref={musicNoteRef}></MusicalNote>
      </Container>
    </CSSTransition>
  );
}
const mapStateToProps = (state) => ({
  hotList: state.getIn(["search", "hotList"]),
  suggestList: state.getIn(["search", "suggestList"]),
  songsList: state.getIn(["search", "songsList"]),
  enterLoading: state.getIn(["search", "enterLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data));
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
