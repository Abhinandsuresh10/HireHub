import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userData?: { 
      name: string,
      mobile: string,
      email: string,
      password: string
    };
    recruiterData?: {
      name: string,
      mobile: string,
      email: string,
      company: string,
      password: string
    }
  }
}
