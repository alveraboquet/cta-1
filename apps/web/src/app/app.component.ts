import { Component, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'cta-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  host: {'class': 'flex w-full h-full'}
})
export class AppComponent {

  constructor(private readonly auth: AngularFireAuth) {
    auth.idToken.subscribe(console.log);
  }
}
