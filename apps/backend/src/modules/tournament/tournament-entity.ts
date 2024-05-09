import { randomUUID } from 'crypto';

interface TournamentProps {
  name: string;
  tournamentOn: string;
  createdAt: Date;
  createdBy: string;
}

export class Tournament {
  private props: TournamentProps;

  private _id: string;

  constructor(props: Omit<TournamentProps, 'createdAt'>, id?: string) {
    this.props = { ...props, createdAt: new Date() };

    this._id = id || randomUUID();
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this.props.name;
  }
  public set name(name: string) {
    this.props.name = name;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get tournamentOn() {
    return this.props.tournamentOn;
  }

  public set tournamentOn(tournamentOn: string) {
    this.props.tournamentOn = tournamentOn;
  }

  public set createdBy(createdBy: string) {
    this.props.createdBy = createdBy;
  }

  public toJSON(): TournamentProps & { id: string } {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      tournamentOn: this.tournamentOn,
    };
  }
}
