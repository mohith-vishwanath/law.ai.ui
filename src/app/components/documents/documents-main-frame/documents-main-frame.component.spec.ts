import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsMainFrameComponent } from './documents-main-frame.component';

describe('DocumentsMainFrameComponent', () => {
  let component: DocumentsMainFrameComponent;
  let fixture: ComponentFixture<DocumentsMainFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsMainFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsMainFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
