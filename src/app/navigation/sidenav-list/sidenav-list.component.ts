import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs-compat/Subscription';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  public isAuth$: Observable<boolean>;
  public authSubscription: Subscription;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  public onClose(): void {
    this.closeSidenav.emit();
  }

  public onLogout(): void {
    this.onClose();
    this.authService.logout();
  }

}
