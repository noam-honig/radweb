import { Component, Injector, ViewChild } from '@angular/core';
import { Router, Route, CanActivate, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';


import { Context } from '@remult/core';




import { DialogService } from '../../projects/angular/schematics/hello/files/src/app/common/dialog';
import { RouteHelperService } from '@remult/angular';
import { JwtSessionService } from '@remult/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(
    public sessionManager: JwtSessionService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private routeHelper: RouteHelperService,

    public dialogService: DialogService,
    public context: Context) {
    //sessionManager.loadSessionFromCookie();

  }
  signInText() {
    if (this.context.user)
      return this.context.user.name;
    return 'Sign in';
  }
  async signIn() {
    if (!this.context.user) {
   //   this.dialog.open(SignInComponent);
    } else {
      if (await this.dialogService.yesNoQuestion("Would you like to sign out?"))
        this.sessionManager.signout();
    }
  }

  routeName(route: Route) {
    let name = route.path;
    if (route.data && route.data.name)
      name = route.data.name;
    return name;
  }

  currentTitle() {
    if (this.activeRoute && this.activeRoute.snapshot && this.activeRoute.firstChild)
      if (this.activeRoute.firstChild.data && this.activeRoute.snapshot.firstChild.data.name) {
        return this.activeRoute.snapshot.firstChild.data.name;
      }
      else {
        if (this.activeRoute.firstChild.routeConfig)
          return this.activeRoute.firstChild.routeConfig.path;
      }
    return '<%= project %>';
  }


  signOut() {

    this.routeClicked();
    this.sessionManager.signout();
  }
  shouldDisplayRoute(route: Route) {
    if (!(route.path && route.path.indexOf(':') < 0 && route.path.indexOf('**') < 0))
      return false;
    return this.routeHelper.canNavigateToRoute(route);
  }
  //@ts-ignore ignoring this to match angular 7 and 8
  @ViewChild('sidenav') sidenav: MatSidenav;
  routeClicked() {
    if (this.dialogService.isScreenSmall())
      this.sidenav.close();

  }
  test() {

  }

}
