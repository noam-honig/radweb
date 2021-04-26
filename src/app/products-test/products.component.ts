import { Component, OnInit } from '@angular/core';
import { Context, ServerFunction, SqlDatabase, packWhere, BoolColumn, StringColumn, DataAreaSettings, DateColumn, ServerController, NumberColumn, ServerMethod, getColumnsFromObject, Entity, EntityClass, IdEntity, OrFilter, ServerProgress, iterateConfig } from '@remult/core';
import { Products } from './products';
import { DialogService } from '../../../projects/angular/schematics/hello/files/src/app/common/dialog';
import { TestDialogComponent } from '../test-dialog/test-dialog.component';
import { InputAreaComponent } from '../../../projects/angular/schematics/hello/files/src/app/common/input-area/input-area.component';
import { DialogConfig } from '@remult/angular';
import { isConstructorDeclaration } from 'typescript';
import { YesNoQuestionComponent } from '../../../projects/angular/schematics/hello/files/src/app/common/yes-no-question/yes-no-question.component';
import * as csv from 'convert-csv-to-array';





@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
@DialogConfig({
  height: '1500px'

})
export class ProductsComponent implements OnInit {


  constructor(private context: Context) { }


  products = this.context.for(Products).gridSettings({
    allowCRUD: true,
    columnSettings: p => [p.name, p.availableFrom1,p.availableFrom2],
    allowSelection:true
  });

  async ngOnInit() {


    
  }
  @ServerFunction({ allowed: true, queue: true })
  static async doIt1234() {

    let x;
    x.toString();

  }


}
