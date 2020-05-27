const Acl = require('acl')

const acl = new Acl(new Acl.memoryBackend())
acl.allow([
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
      }
    ]
  }
]).then(() => {
  acl.addUserRoles('a', ['ordinary'])
    .then(() => {
      acl.allowedPermissions('a', '/index').then(p => {
        console.log(p)
      })
      acl.isAllowed('a', '/index', 'get')
        .then(allow => {
          console.log(allow)
        })
    })
})
