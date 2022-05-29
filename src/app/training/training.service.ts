import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { UiService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class TrainingService {
    public exerciseChanged = new Subject<Exercise>();
    public exercisesChanged = new Subject<Exercise[]>();
    public finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;

    constructor(
        private db: AngularFirestore, 
        private uiService: UiService,
        private store: Store<fromTraining.State>
    ) {}
    
    public fetchAvailableExercises(): any {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db
		.collection('availableExercies')
		.snapshotChanges()
		.pipe(
			map(docArray => {
				return docArray.map(doc => {
					return {
						id: doc.payload.doc.id,
						name: doc.payload.doc.data()['name'],
						duration: doc.payload.doc.data()['duration'],
						calories: doc.payload.doc.data()['calories']
					}
				})
			})
		)
		.subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching exercises failed, please try again later.', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    public startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    public completeExercise(): void {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...this.runningExercise,
                date: new Date,
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        })
    }

    public cancelExercise(progress: number): void {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date,
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    public fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
    }

    public cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}