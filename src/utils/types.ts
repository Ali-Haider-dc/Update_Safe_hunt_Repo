export type UserSignupParams = {
  displayname: string;
  username: string;
  email?: string;
  phonenumber?: string;
  password: string;
  confirmPassword: string;
};
export type UserLoginParams = {
  username: string;
  password: string;
};
