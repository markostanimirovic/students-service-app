import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, CanDeactivate, Params, Router } from '@angular/router';
import { StudentsFakeService } from '../../services/data/students-fake.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesFakeService } from '../../services/data/places-fake.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/internal/operators';
import { MessagesService } from '../../services/messages.service';
import { b } from '@angular/core/src/render3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../../services/guards/can-deactivate-guard.service';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('confirmDialog') confirmDialog: ElementRef;
  studentForm: FormGroup;
  index: number;
  editMode = false;
  places: string[];
  formButtonClicked = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private studentsService: StudentsFakeService,
              private placesService: PlacesFakeService,
              private messagesService: MessagesService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.places = this.placesService.getAll();
    this.route.params
      .subscribe((params: Params) => {
        this.index = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      });
  }

  private initForm() {
    let firstName: string = null;
    let lastName: string = null;
    let year: number = null;
    let number: number = null;
    let birthPlace: string = null;
    let livingPlace: string = null;
    let adress: string = null;
    let espb: number = null;
    let phoneNumber: string = null;
    let email: string = null;
    let studyField: string = null;

    if (this.editMode) {
      const student = this.studentsService.get(this.index);
      firstName = student.firstName;
      lastName = student.lastName;
      year = student.year;
      number = student.number;
      birthPlace = student.birthPlace;
      livingPlace = student.livingPlace;
      adress = student.adress;
      espb = student.espb;
      phoneNumber = student.phoneNumber;
      email = student.email;
      studyField = student.studyField;
    }

    this.studentForm = new FormGroup({
      'firstName': new FormControl(firstName, [Validators.required]),
      'lastName': new FormControl(lastName, [Validators.required]),
      'year': new FormControl(year, [Validators.required, Validators.pattern(/^\d+$/)]),
      'number': new FormControl(number, [Validators.required, Validators.pattern(/^\d+$/)]),
      'birthPlace': new FormControl(birthPlace, [Validators.required, this.initCap]),
      'livingPlace': new FormControl(livingPlace, [Validators.required, this.initCap]),
      'adress': new FormControl(adress, [Validators.required]),
      'espb': new FormControl(espb, [Validators.required, Validators.pattern(/^\d+$/)]),
      'phoneNumber': new FormControl(phoneNumber, [Validators.required,
        Validators.pattern(/^\(?([0-9]{3})\)?[/. ]([0-9]{6,7})$/)]),
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'studyField': new FormControl(studyField, [Validators.required])
    });
  }

  search = (filter: Observable<string>) =>
    filter.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.places.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))

  initCap = (control: FormControl): { [key: string]: boolean } =>
    (control.value && control.value.charAt(0) === control.value.charAt(0).toUpperCase()) ?
      null : { 'notInitCap': true }

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
    return this.studentForm.hasError('notInitCap', ['birthPlace'])
      && !this.isEmptyBirthPlace() && this.studentForm.get('birthPlace').touched;
  }

  isEmptyLivingPlace() {
    return this.studentForm.hasError('required', ['livingPlace'])
      && (this.studentForm.get('livingPlace').touched || this.studentForm.get('livingPlace').dirty);
  }

  isNotInitCapLivingPlace() {
    return this.studentForm.hasError('notInitCap', ['livingPlace'])
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
      let word = 'dodali novog';
      if (this.editMode) {
        this.studentsService.update(this.index, this.studentForm.value);
        word = 'izmenili';
      } else {
        this.studentsService.add(this.studentForm.value);
      }
      this.messagesService.pushMessage({
        content: `Uspešno ste ${word} studenta
      ${this.studentForm.value.lastName} ${this.studentForm.value.firstName}
      ${this.studentForm.value.number}/${this.studentForm.value.year}`, type: 'success'
      });
      this.placesService.addIfNotExist([this.studentForm.value.livingPlace, this.studentForm.value.birthPlace]);
      this.router.navigate(['../', { relativeTo: this.route }]);
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

}
