import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSoporte } from './chat-soporte';

describe('ChatSoporte', () => {
  let component: ChatSoporte;
  let fixture: ComponentFixture<ChatSoporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSoporte],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSoporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
