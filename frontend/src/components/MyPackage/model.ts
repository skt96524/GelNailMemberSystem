export type GetMyPackagePayload = {
  error?: string;
  Package?: {
    package_id: number;
    due_time?: string;
    plan_id: number;
    package_qty: number;
    plan_name: string;
    name?: string;
    shop_id?: string;
    due_period: number;
    address?: string;
    intro?: string;
    shop_plan_image: string;
    remain?: number;
    price?: number;
    buy_time?: string;
  }[];
};
