import { ColumnStorage } from "../../column-interfaces";
import { DateTimeColumn } from "../datetime-column";
export class DateTimeStorage implements ColumnStorage<string>{
  toDb(val: string) {
    return DateTimeColumn.stringToDate(val);
  }
  fromDb(val: any): string {
    if (typeof val === 'string')
      val = new Date(val);
    var d = val as Date;
    return DateTimeColumn.dateToString(d);
  }

}