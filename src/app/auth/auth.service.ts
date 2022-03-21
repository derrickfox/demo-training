import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService {
    private isAuthenticated = false;
    public authChange = new Subject<boolean>();

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService,
        private uiService: UiService,
        private store: Store<{ui: fromRoot.State}>
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigate(['/login'])
            }
        });
    }
    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afAuth.auth.createUserWithEmailAndPassword(
                authData.email, 
                authData.password
            ).then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                console.log(result);
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar(error.message, null, 3000);
                console.log(error);
            });
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afAuth.auth
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            //this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            console.log(result);
        })
        .catch(error => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(error.message, null, 3000);
            console.log(error);
        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

}