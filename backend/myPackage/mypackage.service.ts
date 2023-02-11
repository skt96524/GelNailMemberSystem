import { Knex } from "knex";

export class MypackageService {
    constructor(public knex: Knex) { }

    async getMyValidPackage(userID: number) {

        let validPackage = await this.knex.raw(/*sql */`
            select users_package.id as package_id,
                users_package.due_time,
                shop_plan.id as plan_id,
                shop_plan.package_qty,
                plan_name,
                shop.name,
                shop.id,
                due_period,
                shop.address,
                shop_plan.intro,
                shop_plan.image,
                price,
                buy_time,
                (shop_plan.package_qty - count(booking.id)) as remain
            from users_package
        inner join shop_plan on shop_plan.id = users_package.shop_plan_id
        join  shop on shop_id = shop.id
        left join booking on booking.package_id = users_package.id
    where users_package.users_id = ?
        and booking.reject_time is null
        and booking.cancel_time is null
        and users_package.due_time > CURRENT_TIMESTAMP

    group by users_package.id,shop.id,
            shop_plan.id
    having (shop_plan.package_qty - count(booking.id)) > 0
        `, [userID])

        return { validPackage: validPackage.rows }

    }

    async getMyInvalidPackage(userID: number) {

        let invalidPackage = await this.knex.raw(/*sql */`
            select users_package.id as package_id,
                users_package.due_time,
                shop_plan.id as plan_id,
                shop_plan.package_qty,
                plan_name,
                shop.name,
                shop.id,
                due_period,
                shop.address,
                shop_plan.intro,
                shop_plan.image,
                price,
                buy_time,
                (shop_plan.package_qty - count(booking.id)) as remain
            from users_package
        inner join shop_plan on shop_plan.id = users_package.shop_plan_id
        join  shop on shop_id = shop.id
        left join booking on booking.package_id = users_package.id
    where users_package.users_id = ?
        and booking.reject_time is null
        and booking.cancel_time is null
    group by users_package.id,shop.id,
            shop_plan.id
     having (shop_plan.package_qty - count(booking.id)) <= 0
     or users_package.due_time < CURRENT_TIMESTAMP
    `       , [userID]
        )
        return { invalidPackage: invalidPackage.rows }

    }


}





//         let result1 = await this.knex.raw(/* sql */ `
//             with count_package as
//              (select package_id, count(package_id,) 
//              as used,package_qty from booking join users_package 
//              on booking.package_id=users_package.id join shop_plan 
//              on users_package.shop_plan_id=shop_plan.id
//              and reject_time is null
//              and cancel_time is null
//              and booking.users_id=62
//             group by package_id,package_qty) 
//              select package_id,package_qty,(package_qty-used) 
//              as remain,used from count_package

//             `)

//         let resutl2 = await this.knex.raw(/* sql */ `
//            select 
// users_package.id as package_id,
// package_qty,
// package_qty as remain,
// 0 as used
// from users_package
// join shop_plan on users_package.shop_plan_id = shop_plan.id
// where users_id = 62
// and users_package.id not in (
//     select package_id as id from booking
// ) 



