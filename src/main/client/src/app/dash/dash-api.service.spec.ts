import { TestBed } from '@angular/core/testing';

import { DashApiService } from './dash-api.service';

describe('DashApiService', () => {
  let service: DashApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
