import { Link } from 'react-router-dom';
import { client } from '../app/query-client';

export function HomePage() {
  const { data, isLoading } = client.tournaments.ping.useQuery(['ping']);

  return (
    <div>
      <h1>my page</h1>
      <Link to="/tournament">Tournament</Link>
      {isLoading ? <p>Loading...</p> : data?.body.message}
    </div>
  );
}
