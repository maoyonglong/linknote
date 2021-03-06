import dateFormat from 'dateformat'
import { DATE_FORMAT } from './config'

export const toDateExpression = date => dateFormat(date, DATE_FORMAT)
export const parseJSON = data => JSON.parse(data)
export const stringifyJSON = data => JSON.stringify(data)
