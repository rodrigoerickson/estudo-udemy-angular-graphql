import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent  {

  constructor(
      private authService: AuthService,
      public title: Title
  ) { }

  onLogout():void{
    this.authService.logout();
  }

}
