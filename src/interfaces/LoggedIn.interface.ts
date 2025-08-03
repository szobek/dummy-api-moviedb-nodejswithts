interface loggedIn {
  token: string | null;
  success: boolean;
  message: string;
  refreshToken: string | null;
}
export default loggedIn;