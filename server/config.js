export const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss'
export const UPLOAD_ROOT = './static/uploads'
export const STATIC_ROOT = './static'
export const ACL_CONFIG = [
  {
    roles: ['ordinary'],
    allows: [
      {
        resources: [
          // pages
          '/',
          '/index',
          '/login',
          '/read',
          '/profile',
          'register',
          '/write',
          // api
          '/api/articles',
          '/api/articles/a/:aid?',
          '/api/folders/u/:uid?',
          '/api/profile/u/:uid',
          '/api/profile/self'
        ],
        permissions: ['get']
      },
      {
        resources: [
          '/api/login',
          '/api/register',
          '/api/article/del',
          '/api/article/add',
          '/api/article/rename',
          '/api/article/update',
          '/api/article/publish',
          '/api/profile/add',
          '/api/folder/add',
          '/api/folder/del',
          '/api/folder/setPrivacy',
          '/api/folder/rename',
          '/api/profile/add',
          '/api/profile/avatar/update',
          '/api/profile/update',
          '/uploads/images',
          '/api/login',
          '/api/logout',
          '/api/register',
          '/api/register/activate'
        ],
        permissions: ['post']
      }
    ]
  },
  {
    roles: ['admin'],
    allows: []
  }
]
export const NEED_LOGIN = [
  '/write',
  '/profile'
]
