interface loggedIn {
  success: boolean;
  message: string;
  user: {
    accessToken: string | null;
    role: string | null;
    approved: boolean | null;
    refreshToken: string | null;
    id: number;
    email: string;
    name: string;
  };
}
export default loggedIn;
