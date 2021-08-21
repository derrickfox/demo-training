import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() public sidenavToggle = new EventEmitter<void>();
  public isAuth: boolean = false;
  public authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  public onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
