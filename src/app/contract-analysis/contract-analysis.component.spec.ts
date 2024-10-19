import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAnalysisComponent } from './contract-analysis.component';

describe('ContractAnalysisComponent', () => {
  let component: ContractAnalysisComponent;
  let fixture: ComponentFixture<ContractAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
