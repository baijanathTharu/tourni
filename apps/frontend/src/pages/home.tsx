import { client } from '../app/query-client';
import { Navbar } from '../components/navbar';
import { Card } from '../components/card';
import { Spinner } from '../components/spinner';
import { Button, useDisclosure } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { FormModal } from '../components/form-modal';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { flushSync } from 'react-dom';

export function TournamentList({
  data,
  isLoading,
  isError,
  errorMessage,
}: {
  data: {
    id: string;
    name: string;
    tournamentOn: string;
    createdBy: string;
  }[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}) {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onUpdate = (id: string) => {
    flushSync(() => {
      setSelectedId(id);
    });
    onOpen();
  };

  const selectedTournament = data.find((t) => t.id === selectedId);

  if (isLoading) return <Spinner />;

  if (isError) return <p>{errorMessage}</p>;

  return (
    <section
      data-test-id="tournament-list"
      className="flex flex-wrap justify-center gap-4"
    >
      {data.map((tournament) => {
        return (
          <Card
            id={tournament.id}
            onUpdate={() => onUpdate(tournament.id)}
            key={tournament.id}
          />
        );
      })}
      <FormModal
        data={
          selectedTournament
            ? {
                type: 'update',
                initialValues: selectedTournament,
                id: selectedTournament.id,
              }
            : {
                type: 'create',
              }
        }
        onSuccess={() => {
          setSelectedId(null);
          qc.invalidateQueries({
            queryKey: ['tournaments'],
          });
        }}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </section>
  );
}

export function HomePage() {
  const { data, isLoading, isError } = client.tournaments.tournaments.useQuery([
    'tournaments',
  ]);
  const qc = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold py-6">Tournaments</h2>
          <Button onPress={onOpen} color="success" endContent={<Plus />}>
            Create
          </Button>
        </div>
        <TournamentList
          data={data?.body.data || []}
          isLoading={isLoading}
          isError={isError}
        />
        <FormModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
          data={{
            type: 'create',
          }}
          onSuccess={() => {
            console.log('invalidating...');
            qc.invalidateQueries({
              queryKey: ['tournaments'],
            });
          }}
        />
      </div>
    </>
  );
}
