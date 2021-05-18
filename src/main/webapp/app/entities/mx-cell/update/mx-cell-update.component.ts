import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMxCell, MxCell } from '../mx-cell.model';
import { MxCellService } from '../service/mx-cell.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';

@Component({
  selector: 'jhi-mx-cell-update',
  templateUrl: './mx-cell-update.component.html',
})
export class MxCellUpdateComponent implements OnInit {
  isSaving = false;

  tasksSharedCollection: ITask[] = [];

  editForm = this.fb.group({
    id: [],
    lg: [],
    style: [],
    task: [],
  });

  constructor(
    protected mxCellService: MxCellService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mxCell }) => {
      this.updateForm(mxCell);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mxCell = this.createFromForm();
    if (mxCell.id !== undefined) {
      this.subscribeToSaveResponse(this.mxCellService.update(mxCell));
    } else {
      this.subscribeToSaveResponse(this.mxCellService.create(mxCell));
    }
  }

  trackTaskById(index: number, item: ITask): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMxCell>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mxCell: IMxCell): void {
    this.editForm.patchValue({
      id: mxCell.id,
      lg: mxCell.lg,
      style: mxCell.style,
      task: mxCell.task,
    });

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing(this.tasksSharedCollection, mxCell.task);
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing(tasks, this.editForm.get('task')!.value)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));
  }

  protected createFromForm(): IMxCell {
    return {
      ...new MxCell(),
      id: this.editForm.get(['id'])!.value,
      lg: this.editForm.get(['lg'])!.value,
      style: this.editForm.get(['style'])!.value,
      task: this.editForm.get(['task'])!.value,
    };
  }
}
