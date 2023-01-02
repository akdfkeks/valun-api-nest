import '';

declare global {
  namespace Express {
    export interface User {
      userId: string;
    }
  }
}
