import { Sort } from './sort';
import { Filter } from './filter/filter-interfaces';
import { EntityMetadata } from './remult3';


export interface DataProvider {
  getEntityDataProvider(entity: EntityMetadata): EntityDataProvider;
  transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void>;
  supportsCustomFilter?: boolean;
}

export interface EntityDataProvider {
  count(where: Filter): Promise<number>;
  find(options?: EntityDataProviderFindOptions): Promise<Array<any>>;
  update(id: any, data: any): Promise<any>;
  delete(id: any): Promise<void>;
  insert(data: any): Promise<any>;
}
export interface EntityDataProviderFindOptions {
  where?: Filter;
  limit?: number;
  page?: number;
  orderBy?: Sort;
  __customFindData?: any;
}
export interface RestDataProviderHttpProvider {
  post(url: string, data: any): Promise<any>;
  delete(url: string): Promise<void>;
  put(url: string, data: any): Promise<any>;
  get(url: string): Promise<any>;

}



export function extractSort(sort: any): Sort {

  if (sort instanceof Sort)
    return sort;
  if (sort instanceof Array) {
    let r = new Sort();
    sort.forEach(i => {
      r.Segments.push(i);
    });
    return r;
  }
}


export interface ErrorInfo {
  message?: string;
  modelState?: { [key: string]: string };
  stack?: string;
  exception?: any;
}
