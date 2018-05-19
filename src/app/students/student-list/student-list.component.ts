import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentsFakeService } from '../../services/data/students-fake.service';
import { Student } from '../../models/student.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {

  students: Student[];
  studentsChangedSubscription: Subscription;

  constructor(private studentsService: StudentsFakeService) {}

  ngOnInit() {
    this.students = this.studentsService.getAll();
    this.studentsChangedSubscription = this.studentsService.studentsChanged
      .subscribe((students: Student[]) => this.students = students);
  }

  ngOnDestroy() {
    this.studentsChangedSubscription.unsubscribe();
  }

}
