import Acl from 'acl'
import {ACL_CONFIG} from './config'

async function genAcl () {
  let acl = global.acl
  if (!acl) {
    acl = new Acl(new Acl.memoryBackend())
    global.acl = acl
    await acl.allow(ACL_CONFIG)
  }

  return acl
}

export default genAcl()
