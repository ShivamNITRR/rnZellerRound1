import React from 'react';
import { ZellerCustomer } from '../graphql/types';
import ListItem from './ListItem';

const UserCard: React.FC<{ user: ZellerCustomer }> = ({ user }) => {
  const { name, role } = user ?? {};
  return <ListItem title={name} subtitle={role} />;
};

export default UserCard;