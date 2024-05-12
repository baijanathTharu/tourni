import { client } from './query-client';
import { QCProvider } from './query-client-provider';

function MyPage() {
  const { data, isLoading } = client.tournaments.ping.useQuery(['ping']);

  return (
    <div>
      <h1>my page</h1>
      {isLoading ? <p>Loading...</p> : data?.body.message}
    </div>
  );
}

export function App() {
  return (
    <QCProvider>
      <MyPage />
    </QCProvider>
  );
}

export default App;
