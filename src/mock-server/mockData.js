const roles = ['Admin', 'Manager'];

const mockCustomers = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: roles[i % roles.length],
}));

export default mockCustomers;
