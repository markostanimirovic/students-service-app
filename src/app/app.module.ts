import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';
import { StudentListComponent } from './students/student-list/student-list.component';
import { StudentItemComponent } from './students/student-list/student-item/student-item.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { StudentDetailComponent } from './students/student-detail/student-detail.component';
import { StudentStartComponent } from './students/student-start/student-start.component';
import { MessagesComponent } from './messages/messages.component';

import { StudentsService } from './services/data/students.service';
import { StudentsFakeService } from './services/data/students-fake.service';
import { MessagesService } from './services/messages.service';
import { PlacesFakeService } from './services/data/places-fake.service';
import { PlacesService } from './services/data/places.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    StudentsComponent,
    StudentListComponent,
    StudentItemComponent,
    StudentEditComponent,
    StudentDetailComponent,
    StudentStartComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StudentsService, StudentsFakeService,
    MessagesService, PlacesService,
    PlacesFakeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
