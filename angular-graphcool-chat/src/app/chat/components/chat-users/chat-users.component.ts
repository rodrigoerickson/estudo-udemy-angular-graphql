import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-chat-users',
    templateUrl: './chat-users.component.html',
    styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit {

    users$: Observable<User[]>
    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.users$ = this.userService.allUsers();
    }

}
