import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
    public exerciseChanged = new Subject<Exercise>();
    private availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 44, calories: 3 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 12 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 3 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise: Exercise;


    public getAvailableExercises(): Exercise[] {
        return this.availableExercises.slice();
    }

    public startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise })
    }
}