import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule { }
