import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'cta-web-auth-logout',
  templateUrl: './logout.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  host: { class: 'flex w-full h-full justify-center content-center' }
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly auth: AngularFireAuth
  ) { }

  async ngOnInit(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['auth', 'login']);
  }

}
