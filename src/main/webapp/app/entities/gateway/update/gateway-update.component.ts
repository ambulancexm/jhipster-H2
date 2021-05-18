import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGateway, Gateway } from '../gateway.model';
import { GatewayService } from '../service/gateway.service';

@Component({
  selector: 'jhi-gateway-update',
  templateUrl: './gateway-update.component.html',
})
export class GatewayUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected gatewayService: GatewayService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gateway }) => {
      this.updateForm(gateway);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gateway = this.createFromForm();
    if (gateway.id !== undefined) {
      this.subscribeToSaveResponse(this.gatewayService.update(gateway));
    } else {
      this.subscribeToSaveResponse(this.gatewayService.create(gateway));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGateway>>): void {
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

  protected updateForm(gateway: IGateway): void {
    this.editForm.patchValue({
      id: gateway.id,
    });
  }

  protected createFromForm(): IGateway {
    return {
      ...new Gateway(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
