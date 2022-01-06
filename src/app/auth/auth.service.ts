import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
    private isAuthenticated = false;
    public authChange = new Subject<boolean>();

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService
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
        this.afAuth.auth.createUserWithEmailAndPassword(
                authData.email, 
                authData.password
            ).then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });
    }

    login(authData: AuthData) {
        this.afAuth.auth.signInWithEmailAndPassword(
                authData.email, 
                authData.password
            ).then(result => {
            console.log(result);
        })
        .catch(error => {
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