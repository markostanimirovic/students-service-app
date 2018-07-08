import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../../services/data/students.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, OnDestroy {

  loading = true;
  id: string;
  student: Student;
  getByIdSubscription: Subscription;
  studentDeletedSubscription: Subscription;

  @ViewChild('confirmDialog') confirmDialog: ElementRef;

  constructor(private route: ActivatedRoute, private studentsService: StudentsService,
              private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.loading = true;
      this.studentsService.getById(this.id);
    });

    this.getByIdSubscription = this.studentsService.studentById.subscribe((student: Student) => {
      this.student = student;
      this.loading = false;
    });

    this.studentDeletedSubscription = this.studentsService.deletedStudent.subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  onEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.modalService.open(this.confirmDialog, { centered: true, backdrop: 'static' })
      .result.then((result: boolean) => {
      if (result) {
        this.studentsService.delete(this.id, this.student);
      }
    });
  }

  ngOnDestroy() {
    this.getByIdSubscription.unsubscribe();
    this.studentDeletedSubscription.unsubscribe();
  }

}
