import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatTabComponent } from './components/chat-tab/chat-tab.component';
import { AuthGuard } from '../login/auth.guard';
import { ChatUsersComponent } from './components/chat-users/chat-users.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';

const routes: Routes = [
    {
        path: '',
        component: ChatTabComponent,
        canActivate:[AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: 'users', component: ChatUsersComponent},
            { path: '', component: ChatListComponent}
        ]
    },{
        path:':id', component: ChatWindowComponent, canActivate:[ AuthGuard ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
