import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form = new FormGroup({
    username: new FormControl<string>(''),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  router = inject(Router);

  handleLogin() {
    let raw = localStorage.getItem('credentials');
    console.log(raw)
    let credentials = raw ? JSON.parse(raw) : null;
    console.log(credentials)
    if(credentials === null) {
      alert("Please create an account before logging in")
      this.router.navigate(['register']);
      return
    }

    if (credentials.username !== this.form.value.username) {
      alert('Username incorrect or does not exit');
    } else if (credentials.password !== this.form.value.password) {
      alert('Password incorrect or does not exit');
    } else {
      this.router.navigate(['home']);
    }
  }
}
