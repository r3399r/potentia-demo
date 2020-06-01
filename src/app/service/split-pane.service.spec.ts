import { TestBed } from '@angular/core/testing';
import { SplitPaneService } from 'src/app/service/split-pane.service';

describe('SplitPaneService', () => {
  let service: SplitPaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SplitPaneService
      ],
    });
    service = TestBed.inject(SplitPaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setDisable should work', () => {
    service.setDisable(false)
    // tslint:disable-next-line: no-string-literal
    expect(service['disable']).toBe(false)
  });
});
