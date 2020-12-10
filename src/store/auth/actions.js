
import { Alert } from 'react-native';
import {
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
} from './constants';
import * as authServices from './services';

export const signInWithEmailAndPasswordAction = ({ email, password }) => async (dispatch, getState) => {
  const signinResponse = await authServices.signinService({ username: email, password })
  if (signinResponse && signinResponse.data) {
    dispatch({ type: SIGNIN_SUCCESS, payload: { token: signinResponse.data.token } })
  }
  return signinResponse
};

export const ssoAuthAction = (social, socialAccessToken, extraData = null) => async (dispatch, getState) => {
  const authSSOResponse = await authServices.ssoAuthService(social, socialAccessToken, extraData = null)
  if (authSSOResponse && authSSOResponse.data) {
    dispatch({ type: SIGNIN_SUCCESS, payload: { token: authSSOResponse.data.token } })
  }
  return authSSOResponse
};

export const signOutAction = () => async (dispatch, getState) => {
  // NavigationService.navigate('SigninScreen')
  setTimeout(() => {
    dispatch({ type: SIGNOUT_SUCCESS });
  }, 200);
};