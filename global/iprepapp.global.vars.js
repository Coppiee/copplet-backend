let initialPath = '';
if (process.env.NODE_ENV == 'development') {
  initialPath = 'temp';
} else if (process.env.NODE_ENV == 'beta') {
  initialPath = 'beta';
}

const global_lists = initialPath + '/content_maps/global_lists';
const notification_path = '/notifications/webNotifications';
// iPrep App Global Vars
export const PATH_TO = {
  topics: initialPath + '/content_maps/topics_list',
  content_list: initialPath + '/content_maps/home_content_list',
  classwise: initialPath + '/content_maps/questions_db',
  logger: 'logger',
  content_maps: 'content_maps',
  testprep_content_maps: initialPath + '/content_maps/testprep_content',
  reports: initialPath + '/reports',
  global_lists: global_lists,
  language_all: `${global_lists}/global_language_list`,
  board_all: `${global_lists}/global_board_list`,
  subject_all: `${global_lists}/global_subject_list`,
  subcategory_list: `${global_lists}/global_subcategory_list`,
  maincategory_list: `${global_lists}/global_main_category_list`,
  classes_all: `${global_lists}/global_class_list`,
  stream_all: `${global_lists}/global_stream_list`,
  user_types_list: `${global_lists}/global_user_type_list`,
  app_languages_list: `${global_lists}/app_languages`,
  onboard_cards: 'onboard_tutorial',
  trial_status: initialPath + '/userTrial',
  user_types: 'other_maps/app_user_type',
  temp_otp: 'other_maps/temp_otp',
  user_maps: 'user_maps',
  users: 'user_maps/users',
  user_plans: initialPath + '/user_plans',
  retail_plan: initialPath + '/user_plans/retail_plan_relation',
  static_maps: initialPath + '/static_maps',
  referral_maps: initialPath + '/referrals_scholarship_subscription_plans',
  faqs: initialPath + `/static_maps/faqs`,
  testprep_project_user_relation: 'user_maps/test_prep_data/product_id_user_relation',
  migrated_user_path: 'user_maps/migratedUsers',
  index_user_path: `${notification_path}/indexedRecipients`,
  notification_data_path: `${notification_path}/messages`,
  notification_user_path: `${notification_path}/recipients`,
  notification_path: notification_path,
  app_coupon_codes: 'coupon_codes/app_codes',
  app_coupon_code_history: 'coupon_codes/app_code_history',
  mail_recipients: '/backenddata/auto_mail_recipients/iprep-app',
};
