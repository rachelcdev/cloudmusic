import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import MiniPlayer from "./miniPlayer/index";
import NormalPlayer from "./normalPlayer/index";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from "./store/actions";
import {
  getSongUrl,
  isEmptyObject,
  findIndex,
  shuffle,
  playMode,
} from "../../api/utils";
import Toast from "../../basicUI/Toast";
import PlayList from "./PlayList/index";
import { getLyricRequest } from "../../api/request";
import Lyric from "../../api/LyricParse";
function Player(props) {
  const {
    fullScreen,
    playing,
    currentSong,
    showPlayList,
    mode,
    currentIndex,
    playList,
    sequencePlayList,
  } = props;

  const {
    togglePlayingDispatch,
    toggleFullScreenDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
  } = props;
  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);
  const [modeText, setModeText] = useState("");

  const [preSong, setPreSong] = useState({});
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  const audioRef = useRef();
  const toastRef = useRef();
  const songReady = useRef(true);
  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  const currentSongJS = currentSong ? currentSong.toJS() : null;
  const playListJS = playList ? playList.toJS() : null;
  const sequencePlayListJS = sequencePlayList ? sequencePlayList.toJS() : null;

  useEffect(() => {
    if (
      !playListJS.length ||
      currentIndex === -1 ||
      !playListJS[currentIndex] ||
      playListJS[currentIndex].id === preSong.id ||
      !songReady.current
    ) {
      return;
    }

    let current = playListJS[currentIndex];
    changeCurrentDispatch(current); //赋值currentSong
    setPreSong(current);
    songReady.current = false;
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    getLyric(current.id);
    togglePlayingDispatch(true); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
  }, [playListJS, currentIndex]);
  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);
  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };
  const getLyric = (id) => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    getLyricRequest(id)
      .then((data) => {
        console.log(data);
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLyric.current = new Lyric(lyric, handleLyric);
        currentLyric.current.play();
        currentLineNum.current = 0;
        currentLyric.current.seek(0);
      })
      .catch(() => {
        songReady.current = true;
        audioRef.current.play();
      });
  };
  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };
  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playListJS.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) {
      index = playListJS.length - 1;
    }
    if (!playing) {
      togglePlayingDispatch(true);
    }
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playListJS.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playListJS.length) index = 0;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    changeCurrentIndexDispatch(index);
  };
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayListJS);
      let index = findIndex(currentSong, sequencePlayListJS);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayListJS);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayListJS);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };
  const handleError = () => {
    songReady.current = true;
    alert("播放出错");
  };
  return (
    <div>
      {!isEmptyObject(currentSongJS) ? (
        <MiniPlayer
          song={currentSongJS}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent}
          clickPlaying={clickPlaying}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        />
      ) : null}
      {!isEmptyObject(currentSongJS) ? (
        <NormalPlayer
          song={currentSongJS}
          fullScreen={fullScreen}
          toggleFullScreen={toggleFullScreenDispatch}
          playing={playing}
          clickPlaying={clickPlaying}
          duration={duration} //总时长
          currentTime={currentTime} //播放时间
          percent={percent} //进度
          onProgressChange={onProgressChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          mode={mode}
          changeMode={changeMode}
          togglePlayList={togglePlayListDispatch}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
        />
      ) : null}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"]),
});
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
