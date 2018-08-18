import { Student } from '../../models/student.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { MessagesService } from '../messages.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

const BACKEND_URL = environment.apiUrl + '/students/';

@Injectable()
export class StudentsService {
  private students: Student[] = [];
  studentsUpdated = new Subject<Student[]>();
  studentById = new Subject<Student>();
  deletedStudent = new Subject();
  insertedStudent = new Subject();
  updatedStudent = new Subject();

  constructor(private http: HttpClient,
              private messagesService: MessagesService,
              private authService: AuthService) { }

  getAll() {
    this.http.get(BACKEND_URL)
      .pipe(map((data: { type: string, count: number, students: any[] }) => {
        if (data.type === 'success') {
          return data.students.map((s: any) => {
            const student: Student = {
              id: s._id,
              number: s.number,
              year: s.year,
              firstName: s.firstName,
              lastName: s.lastName,
              birthPlace: s.birthPlace,
              livingPlace: s.livingPlace,
              adress: s.adress,
              espb: s.espb,
              phoneNumber: s.phoneNumber,
              email: s.email,
              studyField: s.studyField
            };
            return student;
          });
        } else {
          throw new Error();
        }
      })).subscribe((students: any[]) => {
      this.students = students;
      this.studentsUpdated.next(this.students.slice(0));
    }, () => {
      this.messagesService.pushMessage({
        content: 'Došlo je do greške prilikom dovlačenja studenata sa servera.',
        type: 'danger'
      });
    });
  }

  getById(id: string) {
    this.http.get(BACKEND_URL + id).pipe(map((data: { type: string, student: any }) => {
      if (data.type === 'success') {
        const student: Student = {
          id: data.student._id,
          number: data.student.number,
          year: data.student.year,
          firstName: data.student.firstName,
          lastName: data.student.lastName,
          birthPlace: data.student.birthPlace,
          livingPlace: data.student.livingPlace,
          adress: data.student.adress,
          espb: data.student.espb,
          phoneNumber: data.student.phoneNumber,
          email: data.student.email,
          studyField: data.student.studyField
        };
        return student;
      } else {
        throw new Error();
      }
    })).subscribe((student: Student) => {
      this.studentById.next(student);
    }, () => {
      this.messagesService.pushMessage({
        content: 'Došlo je do greške prilikom dovlačenja studenta sa servera!',
        type: 'danger'
      });
    });
  }

  delete(id: string, student: Student) {
    this.http.delete(BACKEND_URL + id)
      .subscribe((data: { type: string, message: string }) => {
        this.getAll();
        if (data.type === 'success') {
          this.deletedStudent.next();
          this.messagesService.pushMessage({
            content: `Uspešno ste obrisali studenta ${student.lastName}
            ${student.firstName} ${student.number}/${student.year}!`, type: 'success'
          });
        } else {
          throw new Error();
        }
      }, (error) => {
        this.messagesService.pushMessage({
          content: `Došlo je do greške prilikom brisanja studenta ${student.lastName}
            ${student.firstName} ${student.number}/${student.year}!`, type: 'danger'
        });
      });
  }

  update(id: string, student: Student) {
    this.http.put(BACKEND_URL + id, student)
      .subscribe((data: { type: string, message: string }) => {
        this.getAll();
        if (data.type === 'success') {
          this.updatedStudent.next();
          this.messagesService.pushMessage({
            content: 'Student je uspešno izmenjen!',
            type: 'success'
          });
        } else {
          throw new Error();
        }
      }, (error) => {
        this.messagesService.pushMessage({
          content: 'Došlo je do greške prilikom izmene studenta!',
          type: 'danger'
        });
      });
  }

  insert(student: Student) {
    this.http.post(BACKEND_URL, student)
      .subscribe((data: { type: string, message: string }) => {
        this.getAll();
        if (data.type === 'success') {
          this.insertedStudent.next();
          this.messagesService.pushMessage({
            content: 'Novi student je uspešno unet!',
            type: 'success'
          });
        } else {
          throw new Error();
        }
      }, (error) => {
        this.messagesService.pushMessage({
          content: 'Došlo je do greške prilikom unosa novog studenta!',
          type: 'danger'
        });
      });
  }

}
