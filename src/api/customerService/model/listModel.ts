export interface GetCustomerListModel {
  data: {
    customer_id: number;
    agent_id: number;
    status: number;
    phone: string;
    name: string;
    consultant_role_id: number;
    avatar: string;
    remark: string;
    customer_consultant_count: number;
  };
}

export interface AddOrEditCustomerModel {
  phone: string;
  name: string;
  remark: string;
  avatar: string;
  status: string;
  customer_id: string;
}
