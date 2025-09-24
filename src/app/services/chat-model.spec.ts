import { TestBed } from '@angular/core/testing';

import { ChatModel } from './chat-model';

describe('ChatModel', () => {
  let service: ChatModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
