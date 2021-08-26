import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
    public exerciseChanged = new Subject<Exercise>();
    private availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 1, calories: 3 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 2, calories: 12 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 3, calories: 3 },
        { id: 'burpees', name: 'Burpees', duration: 4, calories: 8 }
    ];
    private runningExercise: Exercise;

    public getAvailableExercises(): Exercise[] {
        return this.availableExercises.slice();
    }

    public startExercise(selectedId: string) {
        console.log('start exercise!!')
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        console.log('this.runningExercise', this.runningExercise)
        this.exerciseChanged.next({ ...this.runningExercise })
    }

    public getRunningExercise() {
        return { ...this.runningExercise };
    }
}