import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  private userService: UserService;
  public user: User = { account: '', name: '' }

  constructor(userService: UserService) {
    this.userService = userService
  }

  async ngOnInit() {
    this.user = await this.userService.getUser()
  }

}
