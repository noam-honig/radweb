import { ColumnStorage } from "../../column-interfaces";


export class DateTimeDateStorage implements ColumnStorage<string>{
  toDb(val: string) {

    if (!val || val == '' || val == '0000-00-00')
      return undefined;
    var x =  new Date(Date.parse(val));
    if (x) {
      return new Date(x.valueOf() + x.getTimezoneOffset() * 60000);
    }
  }//when using date storage,  the database expects and returns a date local and every where else we relfect on date iso
  fromDb(val: any): string {
    var d = val as Date;
    if (!d)
      return '';
    let month = addZeros(d.getMonth() + 1),
      day = addZeros(d.getDate()),
      year = d.getFullYear();
    return [year, month, day].join('-');
    
  }


}
function addZeros(number: number, stringLength: number = 2) {
  let to = number.toString();
  while (to.length < stringLength)
    to = '0' + to;
  return to;
}

