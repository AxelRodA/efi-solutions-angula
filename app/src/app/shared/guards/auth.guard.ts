import { AuthService } from 'src/app/shared/services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  async canActivate(): Promise<boolean> {
      const {role} = await this.auth.getUser()
    if (role == 'maintenance technician') {
      this.router.navigate(['/expenses']);
      return false;
    }
    return true;
  }
}