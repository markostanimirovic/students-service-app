import { Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from '../../models/student.model';
import { Subscription } from 'rxjs';
import { StudentsService } from '../../services/data/students.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {

  students: Student[];
  studentsUpdatedSubscription: Subscription;
  loading = false;

  constructor(private studentsService: StudentsService) { }

  ngOnInit() {
    this.loading = true;
    this.studentsService.getAll();
    this.studentsUpdatedSubscription = this.studentsService.studentsUpdated
      .subscribe((students: Student[]) => {
        this.students = students;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.studentsUpdatedSubscription.unsubscribe();
  }

}
