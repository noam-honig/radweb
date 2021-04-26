

import { createData } from './RowProvider.spec';
import { fitAsync, itAsync } from './testHelper.spec';

import { Categories } from './testModel/models';

import { iterateConfig } from '../context';
import { Column, Context, createAfterFilter, createAUniqueSort, Entity } from '../..';
import { TestBed } from '@angular/core/testing';
import { EntityOrderBy, EntityWhere, extractSort } from '../data-interfaces';
import { StringColumn } from '../columns/string-column';
import { CompoundIdColumn } from '../columns/compound-id-column';
import { packWhere } from '../filter/filter-consumer-bridge-to-url-builder';


describe("test paged foreach ", async () => {
    iterateConfig.pageSize = 2;

    itAsync("basic foreach with where", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        let i = 0;
        for await (const x of c.iterate(x => x.categoryName.isGreaterOrEqualTo("n"))) {
            expect(x.id.value).toBe([1, 2, 3, 4][i++]);
        }
        expect(i).toBe(4);
    });
    itAsync("basic foreach with where 2", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        let i = 0;
        for await (const x of c.iterate({ where: x => x.categoryName.isGreaterOrEqualTo("n") })) {
            expect(x.id.value).toBe([1, 2, 3, 4][i++]);
        }
        expect(i).toBe(4);
    });
    itAsync("basic foreach with order by", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        let i = 0;
        for await (const x of c.iterate({
            orderBy: x => x.categoryName
        })) {
            expect(x.id.value).toBe([5, 1, 4, 2, 3][i++])
        }
        expect(i).toBe(5);

        expect((await c.iterate({
            orderBy: x => x.categoryName
        }).first()).id.value).toBe(5);

    });

    itAsync("basic foreach with order by desc", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        let i = 0;
        for await (const x of c.iterate({
            orderBy: x => [{ column: x.categoryName, descending: true }]
        })) {
            expect(x.id.value).toBe([3, 2, 4, 1, 5][i++])
        }

        expect(i).toBe(5);
    });
    itAsync("iterate", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        var i = 0;
        for await (const x of c.iterate()) {
            expect(x.id.value).toBe(++i);
        }

        expect(i).toBe(5);
    });
    itAsync("test toArray", async () => {
        let c = await createData(async insert => {
            await insert(1, 'noam');
            await insert(2, 'yael');
            await insert(3, 'yoni');
            await insert(4, 'shay');
            await insert(5, 'ido');
        }, Categories);
        var i = 0;


        for (const x of await c.iterate().toArray()) {
            expect(x.id.value).toBe(++i);
        }
        expect(i).toBe(5);
    });
    itAsync("test make sort unique", async () => {
        let context = new Context();
        let e = context.for(Categories).create();
        function test(orderBy: EntityOrderBy<Categories>, ...sort: Column[]) {
            let s = extractSort(createAUniqueSort(orderBy, e)(e));
            expect(s.Segments.map(x => x.column)).toEqual(sort);
        }
        test(x => x.id, e.id);
        test(x => x.categoryName, e.categoryName, e.id);
    });
    itAsync("test make sort unique", async () => {
        let context = new Context();
        let e = context.for(Categories).create();
        var gs = context.for(Categories).gridSettings({ orderBy: p => p.categoryName });
        e.id.defs.caption = 'id from e';
        e.categoryName.defs.caption = 'category name from e';
        
        function test(orderBy: EntityOrderBy<Categories>, ...sort: Column[]) {
            let s = extractSort(createAUniqueSort(orderBy, e)(e));
            expect(s.Segments.map(x => x.column.defs.caption)).toEqual(sort.map(x=>x.defs.caption));
        }
        test(e => {
            let r = gs.getFilterWithSelectedRows().orderBy(e);
            return extractSort(r);
        }, e.categoryName, e.id);
    });
    itAsync("unique sort and  compound index", async () => {
        let context = new Context();
        let theTable = class extends Entity {
            a = new StringColumn();
            b = new StringColumn();
            c = new StringColumn();
            id = new CompoundIdColumn(this.b, this.c);
        }

        let e = context.for(theTable).create();
        function test<T extends Entity>(blabla: T, orderBy: EntityOrderBy<T>, ...sort: Column[]) {
            let s = extractSort(createAUniqueSort(orderBy, e)(e));
            expect(s.Segments.map(x => x.column)).toEqual(sort);
        }
        test(e, x => [x.b, x.c], e.b, e.c);
        test(e, x => x.a, e.a, e.b, e.c);
        test(e, x => x.b, e.b, e.c);
        test(e, x => x.c, e.c, e.b);
    });
    itAsync("create rows after filter", async () => {
        let context = new Context();
        let theTable = class extends Entity {
            a = new StringColumn();
            b = new StringColumn();
            c = new StringColumn();
            id = new CompoundIdColumn(this.b, this.c);
        }

        let e = context.for(theTable).create();
        e.a.value = 'a';
        e.b.value = 'b';
        e.c.value = 'c';
        function test<T extends Entity>(theEntity: T, orderBy: EntityOrderBy<T>, expectedWhere: EntityWhere<T>) {
            expect(JSON.stringify(packWhere(theEntity, createAfterFilter(orderBy, theEntity)))).toEqual(
                JSON.stringify(packWhere(theEntity, expectedWhere)));
        }
        test(e, x => x.a, x => x.a.isGreaterThan('a'));
        test(e, x => [{ column: x.a, descending: true }], x => x.a.isLessThan('a'));
        test(e, x => [x.a, x.b], x => x.a.isGreaterThan('a').or(x.a.isEqualTo('a').and(x.b.isGreaterThan('b'))));

    });
    itAsync("create rows after filter, values are frozen when filter is created", async () => {
        let context = new Context();
        let theTable = class extends Entity {
            a = new StringColumn();
            b = new StringColumn();
            c = new StringColumn();
            id = new CompoundIdColumn(this.b, this.c);
        }

        let e = context.for(theTable).create();
        e.a.value = 'a';
        e.b.value = 'b';
        e.c.value = 'c';

        let f = createAfterFilter(x => [x.a, x.b], e);
        e.a.value = '1';
        e.b.value = '2';
        expect(JSON.stringify(packWhere(e, f))).toEqual(
            JSON.stringify(packWhere(e, x => x.a.isGreaterThan('a').or(x.a.isEqualTo('a').and(x.b.isGreaterThan('b'))))));

    });
    itAsync("serialize filter with or", async () => {
        let context = new Context();
        let theTable = class extends Entity {
            a = new StringColumn();
            b = new StringColumn();
            c = new StringColumn();
            id = new CompoundIdColumn(this.b, this.c);
        }

        let e = context.for(theTable).create();

        function test<T extends Entity>(theEntity: T, expectedWhere: EntityWhere<T>, expected: any) {
            expect(JSON.stringify(packWhere(theEntity, expectedWhere))).toEqual(
                JSON.stringify(expected));
        }
        test(e,
            x => x.a.isEqualTo('a').and(x.b.isGreaterThan('b')).or(x.a.isGreaterThan('a')),
            {
                OR: [
                    {
                        a: 'a',
                        b_gt: 'b'
                    },
                    {
                        a_gt: 'a'
                    }
                ]
            });
        test(e,
            x => x.a.isEqualTo('a').and(x.b.isGreaterThan('b')),
            {
                a: 'a',
                b_gt: 'b'
            });
        test(e,
            x => x.a.isEqualTo('a').or(x.b.isGreaterThan('b')),
            {
                OR: [
                    { a: 'a' },
                    { b_gt: 'b' }]
            });




    });
})

