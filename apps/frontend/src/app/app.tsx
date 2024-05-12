import { QCProvider } from './query-client-provider';
import { Router } from './router';

export function App() {
  return (
    <QCProvider>
      <Router />
    </QCProvider>
  );
}

export default App;
