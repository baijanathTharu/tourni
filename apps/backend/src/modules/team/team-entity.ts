import { randomUUID } from 'crypto';

interface TeamProps {
  name: string;
  createdAt: Date;
  createdBy: string;
}

export class Team {
  private props: TeamProps;

  private _id: string;

  constructor(props: Omit<TeamProps, 'createdAt'>, id?: string) {
    this.props = { ...props, createdAt: new Date() };

    this._id = id || randomUUID();
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get createdBy(): string {
    return this.props.createdBy;
  }

  public set createdBy(createdBy: string) {
    this.props.createdBy = createdBy;
  }

  public toJSON(): TeamProps & { id: string } {
    return {
      id: this._id,
      name: this.props.name,
      createdAt: this.props.createdAt,
      createdBy: this.props.createdBy,
    };
  }
}
