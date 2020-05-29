import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { SplitPaneService } from 'src/app/service/split-pane.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public router: Router;
  public splitPaneService: SplitPaneService;
  private authService: AuthService

  constructor(router: Router, splitPaneService: SplitPaneService, authService: AuthService) {
    this.router = router;
    this.splitPaneService = splitPaneService;
    this.authService = authService;
  }

  public async canActivate(
    _next: ActivatedRouteSnapshot): Promise<boolean> {
    if (await this.authService.isAuth() === true) {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.splitPaneService.setDisable(true);
      return false;
    }
  }
}
