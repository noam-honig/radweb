import { NgModule } from '@angular/core';
import { DataControl2Component } from './data-control/data-control2.component';
import { DataControl3Component } from './data-control/data-control3.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataFilterInfoComponent } from './data-filter-info/data-filter-info.component';
import { DataGrid2Component } from './date-grid-2/data-grid2.component';

import { actionInfo, Context, RestDataProvider, Action, JwtSessionService } from '@remult/core';

import { NotSignedInGuard, SignedInGuard, RouteHelperService } from './navigate-to-component-route-service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyService, LoaderInterceptor } from './wait/busy-service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WaitComponent } from './wait/wait.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DataArea2Compnent } from './data-area/dataArea2';
import { SelectValueDialogComponent } from './add-filter-dialog/add-filter-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { AuthorizationInterceptor } from '../authorization-interceptor';
import { BidiModule } from '@angular/cdk/bidi';








@NgModule({
  declarations: [DataControl2Component, DataArea2Compnent, DataFilterInfoComponent, DataGrid2Component, WaitComponent, DataControl3Component, SelectValueDialogComponent, FilterDialogComponent],
  imports: [FormsModule, CommonModule, HttpClientModule, MatProgressSpinnerModule, MatDialogModule, BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule, MatIconModule, ReactiveFormsModule, MatCheckboxModule, MatMenuModule, BidiModule],
  providers: [{
    provide: Context,
    useFactory: buildContext,
    deps: [HttpClient, MatDialog]
  }, { provide: JwtSessionService, useClass: JwtSessionService, deps: [Context] }, NotSignedInGuard, SignedInGuard, RouteHelperService,
    BusyService,

  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }]
  ,
  exports: [DataControl2Component, DataFilterInfoComponent, DataGrid2Component, DataArea2Compnent, SelectValueDialogComponent],
  entryComponents: [WaitComponent, SelectValueDialogComponent, FilterDialogComponent]
})
export class RemultModule { }
export function DialogConfig(config: MatDialogConfig) {
  return function (target) {
    target[dialogConfigMember] = config;
    return target;
  };
}
const dialogConfigMember = Symbol("dialogConfigMember");
export function buildContext(http: HttpClient, _dialog: MatDialog) {
  
  let r = new Context(http);

  r.openDialog = async (component, setParameters, returnAValue) => {
    let ref = _dialog.open(component, component[dialogConfigMember]);
    if (setParameters)
      setParameters(ref.componentInstance);
    var r;
    if (ref.beforeClosed)
      r = await ref.beforeClosed().toPromise();
    else

    //@ts-ignore
      r = await ref.beforeClose().toPromise();


    if (returnAValue)
      return returnAValue(ref.componentInstance);
    return r;
  }
  actionInfo.runActionWithoutBlockingUI = async x => await BusyService.singleInstance.donotWait(x);
  actionInfo.startBusyWithProgress = () => BusyService.singleInstance.startBusyWithProgress()
  
  return r;
}