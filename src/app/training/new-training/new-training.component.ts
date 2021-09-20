import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  public exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit() {
    //this.exercises = this.trainingService.getAvailableExercises();
    // this.db.collection('availableExercises').valueChanges().subscribe(result => {
    //   console.log('result', result)
    // });
  }

  public onStartTraining(form: NgForm): void {
    console.log('training!!!')
    this.trainingService.startExercise(form.value.exercise);
  }
}
