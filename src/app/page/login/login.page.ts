import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { SplitPaneService } from 'src/app/service/split-pane.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public router: Router;
  public splitPaneService: SplitPaneService;
  public alertController: AlertController;
  private authService: AuthService;

  public account = ''
  public password = ''
  public checked = false

  constructor(router: Router,
    splitPaneService: SplitPaneService,
    authService: AuthService,
    alertController: AlertController) {
    this.router = router;
    this.splitPaneService = splitPaneService;
    this.authService = authService
    this.alertController = alertController
  }

  ngOnInit() {
  }

  public async onClick() {
    try {
      await this.authService.login(this.account, this.password, this.checked)
      this.router.navigate(['/user']);
      this.splitPaneService.setDisable(false);
    } catch{
      const alert = await this.alertController.create({
        message: 'Wrong account or password.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
