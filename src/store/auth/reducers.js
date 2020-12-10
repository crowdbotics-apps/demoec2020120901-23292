import {
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
} from './constants';

const INITIAL_STATE = {
  token: null,
};

export default function (state = INITIAL_STATE, action) {
  console.log('auth_reducer.js : action', action);
  switch (action.type) {
    case SIGNIN_SUCCESS: {
      return { ...state, token: action.payload.token, };
    }
    case SIGNOUT_SUCCESS: {
      return { ...state, ...INITIAL_STATE };
    }
    default:
      return state;
  }
}