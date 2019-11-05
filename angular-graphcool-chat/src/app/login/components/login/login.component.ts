import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { takeWhile } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/services/error.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    configs = {
        isLogin: true,
        actionText: 'SignIn',
        buttonActionText: 'Create account',
        isLoading: false
    };

    private nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

    private alive = true;

    @HostBinding('class.app-login-spinner') private applySpinnerClass = true;

    constructor(
        public authService: AuthService,
        private errorService: ErrorService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router

    ) { }

    ngOnInit() {
        this.createForm();
        const userData = this.authService.getRememberMe();
        if (userData) {
            this.email.setValue(userData.email);
            this.password.setValue(userData.password);
        }
    }

    createForm(): void {
        this.loginForm = this.formBuilder.group({
            email: [
                '',
                [Validators.required, Validators.email]
            ],
            password: [
                '',
                [
                    Validators.required, Validators.minLength(5)
                ]
            ]
        })
    }

    onSubmit(): void {
        this.configs.isLoading = true;
        console.log(this.loginForm.value)
        const operation =
            (this.configs.isLogin)
                ? this.authService.signinUser(this.loginForm.value)
                : this.authService.signupUser(this.loginForm.value)

        operation
            .pipe(
                takeWhile(() => this.alive)
            )
            .subscribe(res => {
                this.authService.setRememberMe(this.loginForm.value);
                const redirect: string = this.authService.redirectUrl || 'dashboard';
                console.log('redirecting...', res);
                this.router.navigate([redirect]);
                this.authService.redirectUrl = null;
                this.configs.isLoading = false;

            },
                err => {
                    this.configs.isLoading = false;
                    console.log(err);
                    this.snackBar.open(this.errorService.getErrorMessage(err), 'Done', { duration: 5000, verticalPosition: 'top' })
                },
                () => { console.log('observable completado') }
            )
    }

    changeAction(): void {
        this.configs.isLogin = !this.configs.isLogin;
        this.configs.actionText = !this.configs.isLogin ? "SignUp" : "SignIn";
        this.configs.buttonActionText = !this.configs.isLogin ? "Alread have account" : "Create account";
        !this.configs.isLogin ? this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name');
    }

    get email(): FormControl {
        return <FormControl>this.loginForm.get('email')
    }

    get password(): FormControl {
        return <FormControl>this.loginForm.get('password')
    }

    get name(): FormControl {
        return <FormControl>this.loginForm.get('name')
    }

    onKeepSigned(): void {
        this.authService.toggleKeepSigned();
    }
    onRememberMe(): void {
        this.authService.toggleRememberMe();
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
