import { QCProvider } from './query-client-provider';
import { Router } from './router';
import { NextUIProvider } from '@nextui-org/react';

export function App() {
  return (
    <QCProvider>
      <NextUIProvider>
        <main className="">
          <Router />
        </main>
      </NextUIProvider>
    </QCProvider>
  );
}

export default App;
