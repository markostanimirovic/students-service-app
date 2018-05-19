import { Student } from '../../models/student.model';
import { Subject } from 'rxjs';

export class StudentsFakeService {

  private students: Student[];
  studentsChanged: Subject<Student[]>;

  constructor() {
    this.studentsChanged = new Subject<Student[]>();
    this.students = [
      {
        number: 110,
        year: 2014,
        firstName: 'Marko',
        lastName: 'Stanimirović',
        birthPlace: 'Leskovac',
        livingPlace: 'Beograd',
        adress: 'Patrijarha Varnave 14/3',
        espb: 233,
        phoneNumber: '064/5453562',
        email: 'markostanimirovic95@gmail.com',
        studyField: 'ISIT'
      },
      {
        number: 11,
        year: 2013,
        firstName: 'Petar',
        lastName: 'Petrović',
        birthPlace: 'Beograd',
        livingPlace: 'Beograd',
        adress: 'Mačvanska 11',
        espb: 230,
        phoneNumber: '061/111222',
        email: 'petrovicpetar@gmail.com',
        studyField: 'MiO'
      },
      {
        number: 332,
        year: 2014,
        firstName: 'Jovana',
        lastName: 'Jovanović',
        birthPlace: 'Smederevo',
        livingPlace: 'Beograd',
        adress: 'Novopazarska 223a',
        espb: 222,
        phoneNumber: '063/222333',
        email: 'jovanovicjovana@gmail.com',
        studyField: 'OM'
      },
      {
        number: 10,
        year: 2012,
        firstName: 'Miljan',
        lastName: 'Miljanić',
        birthPlace: 'Paraćin',
        livingPlace: 'Beograd',
        adress: 'Stojana Protića 23a',
        espb: 220,
        phoneNumber: '060/3202201',
        email: 'miljan.miljanic@yahoo.com',
        studyField: 'ISIT'
      }
    ];
  }

  getAll(): Student[] {
    return this.students.slice();
  }

  get(index: number) {
    return this.students[index];
  }

  add(student: Student) {
    this.students.push(student);
    this.studentsChanged.next(this.students.slice());
  }

  update(index: number, newStudent: Student) {
    this.students[index] = newStudent;
    this.studentsChanged.next(this.students.slice());
  }

  delete(index: number) {
    this.students.splice(index, 1);
    this.studentsChanged.next(this.students.slice());
  }

}
