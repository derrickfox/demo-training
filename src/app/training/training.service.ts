import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
    public exerciseChanged = new Subject<Exercise>();
    public exercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    constructor(private db: AngularFirestore) {}
    
    public fetchAvailableExercises(): any {
        this.db
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
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        });
    }

    public startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise })
    }

    public completeExercise(): void {
        this.exercises.push({
            ...this.runningExercise,
            date: new Date,
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    public cancelExercise(progress: number): void {
        this.exercises.push({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date,
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    public getRunningExercise() {
        return { ...this.runningExercise };
    }

    public getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}