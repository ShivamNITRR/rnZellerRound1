export type Role = 'ADMIN' | 'MANAGER';

export interface ZellerCustomer {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ZellerCustomerConnection {
  items: ZellerCustomer[];
  nextToken?: string;
}

export interface ListZellerCustomersData {
  listZellerCustomers: ZellerCustomerConnection;
}

export interface StringFilterInput {
  ne?: string;
  eq?: string;
  le?: string;
  lt?: string;
  ge?: string;
  gt?: string;
  contains?: string;
  notContains?: string;
  between?: string[];
  beginsWith?: string;
}

export interface ZellerCustomerFilterInput {
  id?: StringFilterInput;
  name?: StringFilterInput;
  email?: StringFilterInput;
  role?: StringFilterInput;
}

export interface ListZellerCustomersVars {
  filter?: ZellerCustomerFilterInput;
  limit?: number;
  nextToken?: string;
}
