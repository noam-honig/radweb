import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RemultModule } from '@remult/angular';
import { FormsModule } from '@angular/forms';

import {DialogService} from '../../projects/angular/schematics/hello/files/src/app/common/dialog';
import {YesNoQuestionComponent} from '../../projects/angular/schematics/hello/files/src/app/common/yes-no-question/yes-no-question.component';
import { InputAreaComponent } from '../../projects/angular/schematics/hello/files/src/app/common/input-area/input-area.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesComponent } from './categories/categories.component';
import { TestComponent } from './test/test.component';
import { TestDialogComponent } from './test-dialog/test-dialog.component';
import { ProductsComponent } from './products-test/products.component';
//import { SignInComponent } from '../../projects/angular/schematics/hello/files/src/app/common/sign-in/sign-in.component';





@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    CategoriesComponent,
    TestComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    TestDialogComponent//,
  //  SignInComponent
  ],
  providers:[
    DialogService
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RemultModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  entryComponents:[YesNoQuestionComponent,InputAreaComponent,TestDialogComponent],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
