with count_package as (
    select package_id,
        count(package_id) as used,
        package_qty,
        users_package.due_time
    from booking
        join users_package on booking.package_id = users_package.id
        join shop_plan on users_package.shop_plan_id = shop_plan.id
        and reject_time is null
        and cancel_time is null
        and booking.users_id = 62
    group by users_package.id
)
select package_id,
    package_qty,
    (package_qty - used) as remain,
    used
from count_package;