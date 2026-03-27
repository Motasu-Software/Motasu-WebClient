import { TestBed } from '@angular/core/testing';

import { GraphQLAuthService } from './graph-qlauth-service';

describe('GraphQLAuthService', () => {
  let service: GraphQLAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphQLAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
