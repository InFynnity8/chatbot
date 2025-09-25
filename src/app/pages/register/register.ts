import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form = new FormGroup({
    username: new FormControl<string>(''),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    confirmPassword: new FormControl<string>('')
  });

  router  = inject(Router)

  handleRegister(){
    if(this.form.value.password && this.form.value.username && this.form.value.confirmPassword){
      localStorage.setItem('credentials', JSON.stringify({username: this.form.value.username , password: this.form.value.password }))
      this.router.navigate(['login'])    
    }
    else{
      alert("Please Fill Blank Fields")
    }
  }

}
