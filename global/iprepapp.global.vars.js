let initialPath = '';
if (process.env.NODE_ENV == 'development') {
  initialPath = 'temp';
} else if (process.env.NODE_ENV == 'beta') {
  initialPath = 'beta';
}

export const PATH_TO = {
  users: '/user_maps/users',
  user_maps: '/user_maps',
  connection: '/account_connections',
};
