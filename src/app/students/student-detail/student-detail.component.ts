import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StudentsFakeService } from '../../services/data/students-fake.service';
import { Student } from '../../models/student.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {

  index: number;
  student: Student;
  @ViewChild('confirmDialog') confirmDialog: ElementRef;

  constructor(private route: ActivatedRoute, private studentsService: StudentsFakeService,
              private router: Router, private modalService: NgbModal,
              private messagesService: MessagesService) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.index = +params['id'];
        this.student = this.studentsService.get(this.index);
      }
    );
  }

  onEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.modalService.open(this.confirmDialog, { centered: true, backdrop: 'static' })
      .result.then((result: boolean) => {
      if (result) {
        this.studentsService.delete(this.index);
        this.router.navigate(['../'], { relativeTo: this.route });
        this.messagesService
          .pushMessage({content: `Uspešno ste obrisali studenta ${this.student.lastName}
          ${this.student.firstName} ${this.student.number}/${this.student.year}!`, type: 'success' });
      }
    });
  }

}
