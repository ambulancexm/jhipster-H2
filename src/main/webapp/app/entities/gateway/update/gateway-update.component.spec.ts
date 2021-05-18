jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GatewayService } from '../service/gateway.service';
import { IGateway, Gateway } from '../gateway.model';

import { GatewayUpdateComponent } from './gateway-update.component';

describe('Component Tests', () => {
  describe('Gateway Management Update Component', () => {
    let comp: GatewayUpdateComponent;
    let fixture: ComponentFixture<GatewayUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let gatewayService: GatewayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GatewayUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GatewayUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GatewayUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      gatewayService = TestBed.inject(GatewayService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const gateway: IGateway = { id: 456 };

        activatedRoute.data = of({ gateway });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(gateway));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const gateway = { id: 123 };
        spyOn(gatewayService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ gateway });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: gateway }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(gatewayService.update).toHaveBeenCalledWith(gateway);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const gateway = new Gateway();
        spyOn(gatewayService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ gateway });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: gateway }));
        saveSubject.complete();

        // THEN
        expect(gatewayService.create).toHaveBeenCalledWith(gateway);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const gateway = { id: 123 };
        spyOn(gatewayService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ gateway });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(gatewayService.update).toHaveBeenCalledWith(gateway);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
