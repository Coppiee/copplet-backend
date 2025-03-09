let initialPath = '';
if (process.env.NODE_ENV == 'development') {
  initialPath = 'temp';
} else if (process.env.NODE_ENV == 'beta') {
  initialPath = 'beta';
}

export const PATH_TO = {
  users: '/userMaps/users',
  user_maps: '/userMaps',
  connection: '/accountConnections',
  coupleCodeUserRelation: 'userMaps/coupleCodeUserRelation',
};
