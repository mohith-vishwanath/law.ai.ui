import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMainFrameComponent } from './search-main-frame.component';

describe('SearchMainFrameComponent', () => {
  let component: SearchMainFrameComponent;
  let fixture: ComponentFixture<SearchMainFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchMainFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMainFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
