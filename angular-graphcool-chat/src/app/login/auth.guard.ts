import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, 
    CanActivate, 
    RouterStateSnapshot, 
    CanActivateChild, 
    CanLoad, 
    Route
} from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable(
    {providedIn: LoginRoutingModule}
)
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
        return this.authService.isAuthenticate;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

    canLoad (route: Route): Observable<boolean> {
        return this.authService.isAuthenticate
            .pipe(
                take(1)
            );
    }
}