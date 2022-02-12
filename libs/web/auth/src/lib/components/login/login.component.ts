import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'cta-web-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  host: { class: 'flex flex-1' },
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitting: boolean;

  constructor(
    private readonly router: Router,
    private readonly auth: AngularFireAuth
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false),
    });
    this.submitting = false;
  }

  ngOnInit() {
  }

  async handleSubmit() {
    this.submitting = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      );
      await this.router.navigate(['']);
    } finally {
      this.submitting = false;
    }
  }
}
