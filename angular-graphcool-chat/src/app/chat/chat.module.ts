import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChatTabComponent } from './components/chat-tab/chat-tab.component';
import { ChatUsersComponent } from './components/chat-users/chat-users.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';

@NgModule({
  declarations: [ChatTabComponent, ChatUsersComponent, ChatListComponent, ChatWindowComponent],
  imports: [
    SharedModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
