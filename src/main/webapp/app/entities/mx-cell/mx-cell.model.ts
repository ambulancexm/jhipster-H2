import { ITask } from 'app/entities/task/task.model';

export interface IMxCell {
  id?: number;
  lg?: string | null;
  style?: string | null;
  task?: ITask | null;
}

export class MxCell implements IMxCell {
  constructor(public id?: number, public lg?: string | null, public style?: string | null, public task?: ITask | null) {}
}

export function getMxCellIdentifier(mxCell: IMxCell): number | undefined {
  return mxCell.id;
}
