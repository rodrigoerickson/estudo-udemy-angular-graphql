import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, 
    CanActivate, 
    RouterStateSnapshot, 
    CanActivateChild, 
    CanLoad, 
    Route,
    Router
} from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable(
    {providedIn: LoginRoutingModule}
)
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
        return this.checkAuthStaet();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

    canLoad (route: Route): Observable<boolean> {
        return this.checkAuthStaet()
            .pipe(
                take(1)
            );
    }

    private checkAuthStaet():Observable<boolean>{
        return this.authService.isAuthenticate
            .pipe(
                tap(is => {
                    if (!is) {
                        this.router.navigate(['/login']);
                    }
                })
            )
    }
}