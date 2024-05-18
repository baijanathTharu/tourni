import { client } from '../app/query-client';
import { Navbar } from '../components/navbar';
import { Card } from '../components/card';
import { Spinner } from '../components/spinner';

export function TournamentList() {
  const { data, isLoading, isError } = client.tournaments.tournaments.useQuery([
    'tournaments',
  ]);
  if (isLoading) return <Spinner />;

  if (isError) return <p>{data?.body.message}</p>;

  if (data?.status === 200) {
    return (
      <section
        data-test-id="tournament-list"
        className="flex flex-wrap justify-center gap-4"
      >
        {data.body.data.map((tournament) => {
          return <Card key={tournament.id} />;
        })}
      </section>
    );
  }

  return (
    <div>
      <p>No data available</p>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-6">
        <h2 className="text-lg font-semibold py-6">Tournaments</h2>
        <TournamentList />
      </div>
    </>
  );
}
