
import { AndFilter, Filter } from '@remult/core';
import { ComparisonFilterFactory,  FieldRef, EntityWhere, FindOptions, Repository,  ContainsFilterFactory } from "@remult/core";
import {  FieldMetadata } from "@remult/core";
import { getFieldDefinition } from '..';

export class FilterHelper<rowType> {
  filterRow: rowType;
  filterColumns: FieldMetadata[] = [];
  forceEqual: FieldMetadata[] = [];
  constructor(private reloadData: () => void, private repository: Repository<rowType>) {

  }
  isFiltered(columnInput: FieldMetadata | FieldRef<any, any>) {

    return this.filterColumns.indexOf(getFieldDefinition(columnInput)) >= 0;
  }
  filterColumn(columnInput: FieldMetadata | FieldRef<any, any>, clearFilter: boolean, forceEqual: boolean) {
    let column = getFieldDefinition(columnInput);
    if (!column)
      return;
    if (clearFilter) {
      this.filterColumns.splice(this.filterColumns.indexOf(column, 1), 1);
      this.forceEqual.splice(this.forceEqual.indexOf(column, 1), 1);
    }
    else if (this.filterColumns.indexOf(column) < 0) {
      this.filterColumns.push(column);
      if (forceEqual)
        this.forceEqual.push(column);
    }
    this.reloadData();
  }
  addToFindOptions(opt: FindOptions<rowType>) {
    this.filterColumns.forEach(c => {

      //@ts-ignore
      let val = this.filterRow[c.key];
      let w: EntityWhere<rowType> = item => {
        let itemForFilter: ComparisonFilterFactory<any> & ContainsFilterFactory<any> = item[c.key];
        let f: Filter = itemForFilter.isEqualTo(val);
        if (c.valueType == String && !this.forceEqual.find(x => c.key == x.key))
          f = itemForFilter.contains(val);
        else if (c.valueType == Date) {
          if (val) {
            let v = <Date>val;
            v = new Date(v.getFullYear(), v.getMonth(), v.getDate());

            f = itemForFilter.isGreaterOrEqualTo(v).and(itemForFilter.isLessThan((new Date(v.getFullYear(), v.getMonth(), v.getDate() + 1))));
          }
        }
        return f;

      }
     

      if (opt.where) {
        let x = opt.where;
        opt.where = [x, w];
      }
      else opt.where = w;
    });
  }
}
