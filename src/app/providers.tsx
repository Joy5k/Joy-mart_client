'use client';

import { SessionProvider } from 'next-auth/react';
import PageProgressBar from "../components/NextProgress/PageProgressBar";
import ReduxProvider from '../providers/redux-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageProgressBar />
      <ReduxProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ReduxProvider>
    </>
  );
}