import mockCustomers from '../mockData.js';

export function listZellerCustomers(parent, args) {
  const { filter = {}, limit = 20, nextToken } = args;

  let filtered = mockCustomers;

  if (filter.role?.eq) {
    filtered = filtered.filter(c => c.role.toUpperCase() === filter.role.eq.toUpperCase());
  }


  if (filter.name?.eq) {
    filtered = filtered.filter(c => c.name === filter.name.eq);
  } else if (filter.name?.contains) {
    filtered = filtered.filter(c => c.name.includes(filter.name.contains));
  }

  // Pagination
  let startIndex = 0;
  if (nextToken) {
    startIndex = filtered.findIndex(c => c.id === nextToken) + 1;
    if (startIndex === 0) startIndex = 0;
  }

  const paginatedItems = filtered.slice(startIndex, startIndex + limit);
  const newNextToken =
    startIndex + limit < filtered.length
      ? paginatedItems[paginatedItems.length - 1].id
      : null;

  return {
    items: paginatedItems,
    nextToken: newNextToken,
  };
}
