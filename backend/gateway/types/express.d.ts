
export interface SessionUser {
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};
