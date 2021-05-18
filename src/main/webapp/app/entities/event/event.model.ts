export interface IEvent {
  id?: number;
}

export class Event implements IEvent {
  constructor(public id?: number) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
