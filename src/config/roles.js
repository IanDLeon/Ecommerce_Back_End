const allRoles = {
  user: ['createOrder', 'updateOrder', 'cancelOrder'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'manageOrders'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
