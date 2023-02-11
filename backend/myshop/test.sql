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
    shop_plan.price,
    shop_plan.image,
    (shop_plan.package_qty - count(booking.id)) as remain
from users_package
    inner join shop_plan on shop_plan.id = users_package.shop_plan_id
    join shop on shop_id = shop.id
    left join booking on booking.package_id = users_package.id
where users_package.users_id = 45
    and booking.reject_time is null
    and booking.cancel_time is null
    and users_package.due_time > CURRENT_TIMESTAMP
group by users_package.id,
    shop.id,
    shop_plan.id
having (shop_plan.package_qty - count(booking.id)) > 0;