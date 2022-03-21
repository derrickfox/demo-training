import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  public exercises: Exercise[];
  public isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService, 
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
	  this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => (this.exercises = exercises));
	  this.fetchExercies();
  }

  public fetchExercies() {
    this.trainingService.fetchAvailableExercises();
  }

  public onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }

}
