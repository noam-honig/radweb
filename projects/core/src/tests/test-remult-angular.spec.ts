import { DataControl } from '../../../angular';
import { DataControl2Component } from '../../../angular/src/angular/data-control/data-control2.component';
import { Field, getFields } from '../remult3';
import { itAsync, Done, fitAsync } from './testHelper.spec';


class classWithColumn {
    static click: classWithColumn;
    @DataControl<classWithColumn>({
        click: (r) => classWithColumn.click = r
    })
    @Field()
    a: string = '';
    _ = getFields(this);
}

describe("remult angular", () => {

    itAsync("stand alone data control", async () => {
        let dc = new DataControl2Component();
        let c = new classWithColumn();
        c.a = '1';
        dc.field = c._.a;
        dc.click();
        expect(classWithColumn.click.a).toBe('1');
    });


});