export const NOTIFICATION_ACTIONS = {
  AUTHENTICATE: 'AUTHENTICATE',
} as const;

export interface AuthenticateAction {
  type: typeof NOTIFICATION_ACTIONS.AUTHENTICATE;
  payload: {
    accessToken: string;
  };
}
