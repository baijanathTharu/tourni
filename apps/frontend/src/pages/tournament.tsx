import { Link } from 'react-router-dom';
import { client } from '../app/query-client';

export function TournamentPage() {
  const { data, isLoading } = client.tournaments.ping.useQuery(['ping']);

  return (
    <div>
      <h1>Tournament page</h1>
      <Link to="/">Home</Link>
      {isLoading ? <p>Loading...</p> : data?.body.message}
    </div>
  );
}
