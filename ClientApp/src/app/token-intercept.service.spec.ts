import { TestBed } from '@angular/core/testing';

import { TokenIntercept} from './token-intercept.service';

describe('TokenIntercept', () => {
  let service: TokenIntercept;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenIntercept);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
