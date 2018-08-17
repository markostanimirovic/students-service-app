import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, CanDeactivate, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/internal/operators';
import { MessagesService } from '../../services/messages.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../../services/guards/can-deactivate-guard.service';
import { StudentsService } from '../../services/data/students.service';
import { Student } from '../../models/student.model';
import { PlacesService } from '../../services/data/places.service';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit, CanComponentDeactivate, OnDestroy {

  @ViewChild('confirmDialog') confirmDialog: ElementRef;
  studentForm: FormGroup;
  id: string;
  editMode = false;
  places: string[];
  formButtonClicked = false;
  getByIdSubscription: Subscription;
  insertedStudentSubscription: Subscription;
  updatedStudentSubscription: Subscription;
  placesUpdatedSubscription: Subscription;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private studentsService: StudentsService,
              private placesService: PlacesService,
              private messagesService: MessagesService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      if (this.editMode) {
        this.loading = true;
        this.studentsService.getById(this.id);
        this.fillForm();
      }
      this.initForm();
      this.placesService.getAll();
      this.placesUpdatedSubscription = this.placesService.placesUpdated.subscribe((places: string[]) => {
        this.places = places;
      });
    });

    this.insertedStudentSubscription = this.studentsService.insertedStudent.subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });

    this.updatedStudentSubscription = this.studentsService.updatedStudent.subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });

  }

  private initForm() {
    this.studentForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'year': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      'number': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      'birthPlace': new FormControl('',
        [Validators.required, Validators.pattern(/^[A-ZČĆŽŠĐ]([a-zčćžšđ])+([ ][A-ZČĆŽŠĐ][a-zčćžšđ]+)*$/)]),
      'livingPlace': new FormControl('',
        [Validators.required, Validators.pattern(/^[A-ZČĆŽŠĐ]([a-zčćžšđ])+([ ][A-ZČĆŽŠĐ][a-zčćžšđ]+)*$/)]),
      'adress': new FormControl('', [Validators.required]),
      'espb': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      'phoneNumber': new FormControl('', [Validators.required,
        Validators.pattern(/^[0-9]{3}[/][0-9]{6,7}$/)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'studyField': new FormControl('', [Validators.required])
    });
  }

  private fillForm() {
    this.studentsService.studentById.subscribe((student: Student) => {
      this.loading = false;
      const firstName = student.firstName;
      const lastName = student.lastName;
      const year = student.year;
      const number = student.number;
      const birthPlace = student.birthPlace;
      const livingPlace = student.livingPlace;
      const adress = student.adress;
      const espb = student.espb;
      const phoneNumber = student.phoneNumber;
      const email = student.email;
      const studyField = student.studyField;

      this.studentForm = new FormGroup({
        'firstName': new FormControl(firstName, [Validators.required]),
        'lastName': new FormControl(lastName, [Validators.required]),
        'year': new FormControl(year, [Validators.required, Validators.pattern(/^\d+$/)]),
        'number': new FormControl(number, [Validators.required, Validators.pattern(/^\d+$/)]),
        'birthPlace': new FormControl(birthPlace,
          [Validators.required, Validators.pattern(/^[A-ZČĆŽŠĐ]([a-zčćžšđ])+([ ][A-ZČĆŽŠĐ][a-zčćžšđ]+)*$/)]),
        'livingPlace': new FormControl(livingPlace,
          [Validators.required, Validators.pattern(/^[A-ZČĆŽŠĐ]([a-zčćžšđ])+([ ][A-ZČĆŽŠĐ][a-zčćžšđ]+)*$/)]),
        'adress': new FormControl(adress, [Validators.required]),
        'espb': new FormControl(espb, [Validators.required, Validators.pattern(/^\d+$/)]),
        'phoneNumber': new FormControl(phoneNumber, [Validators.required,
          Validators.pattern(/^[0-9]{3}[/][0-9]{6,7}$/)]),
        'email': new FormControl(email, [Validators.required, Validators.email]),
        'studyField': new FormControl(studyField, [Validators.required])
      });

    });
  }

  search = (filter: Observable<string>) =>
    filter.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.places.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));

  isEmptyFirstName() {
    return this.studentForm.hasError('required', ['firstName'])
      && (this.studentForm.get('firstName').touched || this.studentForm.get('firstName').dirty);
  }

  isEmptyLastName() {
    return this.studentForm.hasError('required', ['lastName'])
      && (this.studentForm.get('lastName').touched || this.studentForm.get('lastName').dirty);
  }

  isEmptyYear() {
    return this.studentForm.hasError('required', ['year'])
      && (this.studentForm.get('year').touched || this.studentForm.get('year').dirty);
  }

  isNotYearDigit() {
    return this.studentForm.hasError('pattern', ['year']) && !this.isEmptyYear();
  }

  isEmptyNumber() {
    return this.studentForm.hasError('required', ['number'])
      && (this.studentForm.get('number').touched || this.studentForm.get('number').dirty);
  }

  isNotNumberDigit() {
    return this.studentForm.hasError('pattern', ['number']) && !this.isEmptyNumber();
  }

  isEmptyBirthPlace() {
    return this.studentForm.hasError('required', ['birthPlace'])
      && (this.studentForm.get('birthPlace').touched || this.studentForm.get('birthPlace').dirty);
  }

  isNotInitCapBirthPlace() {
    return this.studentForm.hasError('pattern', ['birthPlace'])
      && !this.isEmptyBirthPlace() && this.studentForm.get('birthPlace').touched;
  }

  isEmptyLivingPlace() {
    return this.studentForm.hasError('required', ['livingPlace'])
      && (this.studentForm.get('livingPlace').touched || this.studentForm.get('livingPlace').dirty);
  }

  isNotInitCapLivingPlace() {
    return this.studentForm.hasError('pattern', ['livingPlace'])
      && !this.isEmptyLivingPlace() && this.studentForm.get('livingPlace').touched;
  }

  isEmptyAdress() {
    return this.studentForm.hasError('required', ['adress'])
      && (this.studentForm.get('adress').touched || this.studentForm.get('adress').dirty);
  }

  isEmptyEspb() {
    return this.studentForm.hasError('required', ['espb'])
      && (this.studentForm.get('espb').touched || this.studentForm.get('espb').dirty);
  }

  isNotEspbDigit() {
    return this.studentForm.hasError('pattern', ['espb']) && !this.isEmptyEspb();
  }

  isEmptyPhoneNumber() {
    return this.studentForm.hasError('required', ['phoneNumber'])
      && (this.studentForm.get('phoneNumber').touched || this.studentForm.get('phoneNumber').dirty);
  }

  isNotPhoneNumberValid() {
    return this.studentForm.hasError('pattern', ['phoneNumber'])
      && !this.isEmptyPhoneNumber() && this.studentForm.get('phoneNumber').touched;
  }

  isEmptyEmail() {
    return this.studentForm.hasError('required', ['email'])
      && (this.studentForm.get('email').touched || this.studentForm.get('email').dirty);
  }

  isNotEmailValid() {
    return this.studentForm.hasError('email', ['email'])
      && !this.isEmptyEmail() && this.studentForm.get('email').touched;
  }

  isEmptyStudyField() {
    return this.studentForm.hasError('required', ['studyField'])
      && (this.studentForm.get('studyField').touched || this.studentForm.get('studyField').dirty);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.formButtonClicked = true;
      if (this.editMode) {
        this.studentsService.update(this.id, this.studentForm.value);
      } else {
        this.studentsService.insert(this.studentForm.value);
      }
      this.placesService.insert([this.studentForm.value.livingPlace, this.studentForm.value.birthPlace]);
    }
  }

  onCancel() {
    this.formButtonClicked = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): Promise<boolean> | Observable<boolean> | boolean {
    if (!this.formButtonClicked && this.studentForm.dirty) {
      return this.modalService.open(this.confirmDialog, { centered: true, backdrop: 'static' })
        .result.then((result: boolean) => result);
    }
    return true;
  }

  ngOnDestroy() {
    if (this.getByIdSubscription) {
      this.getByIdSubscription.unsubscribe();
    }
    this.insertedStudentSubscription.unsubscribe();
    this.updatedStudentSubscription.unsubscribe();
    this.placesUpdatedSubscription.unsubscribe();
  }

}
