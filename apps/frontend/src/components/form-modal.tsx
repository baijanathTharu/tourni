import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLocalTimeZone } from '@internationalized/date';
import { client } from '../app/query-client';
import { useEffect } from 'react';

const CreateTournamentBodySchema = z.object({
  name: z
    .string({
      message: 'name must be a string',
    })
    .min(3, {
      message: 'name must be at least 3 characters long',
    })
    .max(100, {
      message: 'name must be at most 100 characters long',
    }),
  tournamentOn: z.string({
    message: 'tournamentOn must be a date',
  }),
});
type TCreateTournamentBodySchema = z.infer<typeof CreateTournamentBodySchema>;

export function FormModal({
  onSuccess,
  data,
  isOpen,
  onOpen,
  onClose,
  onOpenChange,
}: {
  data:
    | {
        type: 'update';
        initialValues: {
          name: string;
          tournamentOn: string;
        };
        id: string;
      }
    | {
        type: 'create';
      };
  onSuccess: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
}) {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<TCreateTournamentBodySchema>({
    resolver: zodResolver(CreateTournamentBodySchema),
    mode: 'all',
    defaultValues:
      data.type === 'update'
        ? data.initialValues
        : {
            name: '',
            tournamentOn: new Date().toISOString(),
          },
  });

  useEffect(() => {
    if (data.type === 'update') {
      reset(data.initialValues);
    }
  }, [data, reset]);

  const createTournamentMutation =
    client.tournaments.createTournament.useMutation();

  const updateTournamentMutation =
    client.tournaments.updateTournament.useMutation();

  const onSubmit: SubmitHandler<TCreateTournamentBodySchema> = async (
    payload
  ) => {
    if (data.type === 'create') {
      await createTournamentMutation.mutateAsync(
        {
          body: {
            name: payload.name,
            createdBy: 'ram',
            tournamentOn: payload.tournamentOn,
          },
        },
        {
          onSuccess: (data) => {
            if (data.status >= 400) {
              console.log('error', data.body.message);
              return;
            }
            onSuccess();
          },
          onError(error, variables, context) {
            console.log('error ', error);
          },
        }
      );
    }
    if (data.type === 'update') {
      await updateTournamentMutation.mutateAsync(
        {
          body: {
            name: payload.name,
            tournamentOn: payload.tournamentOn,
          },
          params: {
            tournamentId: data.id,
          },
        },
        {
          onSuccess: (data) => {
            if (data.status >= 400) {
              console.log('error', data.body.message);
              return;
            }
            onSuccess();
          },
          onError(error, variables, context) {
            console.log('error ', error);
          },
        }
      );
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {data.type === 'create' ? 'Create' : 'Update'} Tournament
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  placeholder="Enter tournament name"
                  variant="bordered"
                  isRequired
                  {...register('name')}
                  errorMessage={errors.name?.message}
                />
                <DatePicker
                  variant="bordered"
                  label="Tournament Date"
                  isRequired
                  errorMessage={errors.tournamentOn?.message}
                  // value={parseDate(getValues('tournamentOn').toString())}
                  onChange={(value) => {
                    setValue(
                      'tournamentOn',
                      value.toDate(getLocalTimeZone()).toISOString()
                    );
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button color="primary" type="submit">
                  {data.type === 'create' ? 'Create' : 'Update'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
}
