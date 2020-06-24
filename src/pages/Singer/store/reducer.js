import {
  CHANGE_SINGER_DETAIL,
  CHANGE_SONGS_OF_SINGER,
  CHANGE_ENTER_LOADING,
} from "./constants";
import { fromJS } from "immutable";

const initailState = fromJS({
  artist: {},
  songsOfArtist: [],
  enterLoading: true,
});

export default (state = initailState, action) => {
  switch (action.type) {
    case CHANGE_SINGER_DETAIL:
      return state.set("singer", action.data);
    case CHANGE_SONGS_OF_SINGER:
      return state.set("songOfSinger", action.data);
    case CHANGE_ENTER_LOADING:
      return state.set("enterLoading", action.data);

    default:
      return state;
  }
};
