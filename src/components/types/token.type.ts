export type Token = {
  name: string;
  value: string;
};

export type TracksolidTokens = {
  accessToken: Token | undefined;
  refreshToken: Token | undefined;
};
