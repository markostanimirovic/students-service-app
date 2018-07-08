import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/places/';

@Injectable()
export class PlacesService {
  placesUpdated = new Subject<string[]>();

  constructor(private http: HttpClient) { }

  getAll() {
    this.http.get(BACKEND_URL)
      .pipe(map((data: { type: string, count: number, places: any[] }) =>
        data.places.map((element) => element.name)
      ))
      .subscribe((places: string[]) => {
        this.placesUpdated.next(places);
      });
  }

  insert(places: string[]) {
    this.http.post(BACKEND_URL, places).subscribe();
  }

}
