import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHistorySideBarComponent } from './chat-history-side-bar.component';

describe('ChatHistorySideBarComponent', () => {
  let component: ChatHistorySideBarComponent;
  let fixture: ComponentFixture<ChatHistorySideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatHistorySideBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHistorySideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
