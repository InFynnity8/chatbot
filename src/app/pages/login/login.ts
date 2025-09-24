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

  router = inject(Router)

  handleLogin() {
    if(this.form.value.password && this.form.value.username){
      this.router.navigate(['home'])    
    }
    else{
      alert("Please Fill Blank Fields")
    }
  }
   
}
