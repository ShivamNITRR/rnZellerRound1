import { ZellerCustomer } from "../../src/graphql/types";
import { expectElementNotVisible, expectElementVisible, expectTextNotVisible, expectTextVisible } from "../__utils__/assertionHelpers";

export const expectUsersVisible = (users: ZellerCustomer[]) => {
    users.forEach(user => {
        expectTextVisible(`UserCard: ${user.name}`);
        expectElementVisible(`user-card-${user.id}`);
    });
};

export const expectUsersNotVisible = (users: ZellerCustomer[]) => {
    users.forEach(user => {
        expectTextNotVisible(`UserCard: ${user.name}`);
        expectElementNotVisible(`user-card-${user.id}`);
    });
};

export const expectEmptyStateMessageWithText = (searchText: string, noResultString: string, tryDiffTextString: string) => {
    const expectedNoResultText = noResultString.replace('%s1', searchText);
    expectTextVisible(expectedNoResultText);
    expectTextVisible(tryDiffTextString);
};