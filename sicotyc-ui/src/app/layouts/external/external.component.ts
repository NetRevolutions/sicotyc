import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ExternalLayoutComponent implements OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor() {}
  
  ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
  
}
