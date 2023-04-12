import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  cadastro(){
    this.router.navigate(['cadastro']);
  }

  menu(){
    this.router.navigate(['home']);
  }

  historico(){
    this.router.navigate(['historico']);
  }
}
