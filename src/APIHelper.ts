import { ApolloClient } from '@apollo/client';
import { LIST_ZELLER_CUSTOMERS } from './graphql/queries';
import {
    ListZellerCustomersData,
    ListZellerCustomersVars,
    ZellerCustomerFilterInput,
} from './graphql/types';

export async function fetchZellerCustomers(
    client: ApolloClient<object>,
    filter?: ZellerCustomerFilterInput,
    limit = 20, //default let's say for now keeping it 20
    nextToken?: string
): Promise<ListZellerCustomersData['listZellerCustomers']> {
    try {
        console.log('api called---filter--',filter);
        
        const { data } = await client.query<ListZellerCustomersData, ListZellerCustomersVars>({
            query: LIST_ZELLER_CUSTOMERS,
            variables: { filter, limit, nextToken },
            fetchPolicy: 'network-only',
        });

        return data?.listZellerCustomers;
    } catch (error) {
        console.error('Error fetching Zeller customers:', error);
        throw error;
    }
};