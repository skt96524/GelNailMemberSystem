SELECT users_package.id,
    (shop_plan.package_qty > count(booking.id))
    and (users_package.due_time > CURRENT_TIMESTAMP) as is_valid,
    shop_plan.package_qty,
    (shop_plan.package_qty - count(booking.id)) as remain,
    users_package.due_time,
    shop_plan.due_period,
    shop_plan.id as plan_id,
    shop_plan.intro,
    shop_plan.price,
    shop_plan.image
from users_package
    inner join shop_plan on shop_plan.id = users_package.shop_plan_id
    left join booking on booking.package_id = users_package.id
where shop_plan.shop_id = 27
    and users_package.users_id = 45
    and booking.reject_time is null
    and booking.cancel_time is null
group by users_package.id,
    shop_plan.id