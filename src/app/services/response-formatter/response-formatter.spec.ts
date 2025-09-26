import { TestBed } from '@angular/core/testing';

import { ResponseFormatter } from './response-formatter';

describe('ResponseFormatter', () => {
  let service: ResponseFormatter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseFormatter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
