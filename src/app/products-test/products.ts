import { IdEntity, StringColumn, EntityClass, ColumnOptions, Context, ValueListColumn, NumberColumn, DateColumn, DateTimeColumn, ServerMethod, ServerController, BoolColumn, DateTimeDateStorage } from '@remult/core';
@EntityClass

export class Products extends IdEntity {
  name = new StringColumn();
  price = new NumberColumn({ decimalDigits: 2, key: 'price_1' });
  availableFrom1 = new DateColumn();
  availableFrom2 = new DateColumn();
  availableTo = new DateColumn();
  @ServerMethod({ allowed: true })
  async doSomething(p: string) {
    this.name.validationError = p;
    throw 'error';
    await this.save();
  }
  archive = new BoolColumn();
  constructor(context:Context) {
    super({
      name: "Products",
      allowApiCRUD: true,
      saving: () => {
        //console.log({ display: this.availableFrom1.displayValue, raw: this.availableFrom1.rawValue, todb: new DateTimeDateStorage().toDb(this.availableFrom1.rawValue) });
        console.log("saving",{ display: this.availableFrom2.displayValue, raw: this.availableFrom2.rawValue, todb: new DateTimeDateStorage().toDb(this.availableFrom2.rawValue) });
        //       this.validationError = 'dont save';
      }
      ,saved:()=>{
        
        //console.log({ display: this.availableFrom1.displayValue, raw: this.availableFrom1.rawValue, todb: new DateTimeDateStorage().toDb(this.availableFrom1.rawValue) });
        console.log("saved",{ display: this.availableFrom2.displayValue, raw: this.availableFrom2.rawValue, todb: new DateTimeDateStorage().toDb(this.availableFrom2.rawValue) });
        //console.log(this.__debug());
        //console.log(context.for(Products).toApiPojo(this));;
        this["moshe"] = this.__debug();
      }
    });

  }
}

