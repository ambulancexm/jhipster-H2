import { IMxCell } from 'app/entities/mx-cell/mx-cell.model';

export interface ITask {
  id?: number;
  name?: string | null;
  mxCells?: IMxCell[] | null;
}

export class Task implements ITask {
  constructor(public id?: number, public name?: string | null, public mxCells?: IMxCell[] | null) {}
}

export function getTaskIdentifier(task: ITask): number | undefined {
  return task.id;
}
