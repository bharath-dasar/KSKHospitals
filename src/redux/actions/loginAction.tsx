import { login } from '../slices/loginStore';
import { Dispatch } from 'redux';

interface LoginData {
  token: string;
  [key: string]: any; // Add more specific fields if you know them
}

export const loginUser = (data: LoginData) => (dispatch: Dispatch) => {
  dispatch(
    login({
      token: data.token,
      loginData: data,
    })
  );
};
