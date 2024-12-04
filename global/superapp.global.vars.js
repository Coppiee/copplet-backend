let initialPath = '';
if (process.env.NODE_ENV == 'development') {
  initialPath = 'temp';
} else if (process.env.NODE_ENV == 'beta') {
  initialPath = 'beta';
}

export const PATH_TO = {
  reports: initialPath + '/reports',
  categories: 'categories',
  category_sub_category: 'category_subcategory_relation',
  subcategory_category_id_map: 'subcategory_category_id_map',
  sub_category_content: 'subcategory_content_relation',
  user_data: 'user_added_subcategory_relation',
  keys_to_exclude: '-createdAt -updatedAt -__v -_id',
};
