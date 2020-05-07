import dateFormat from 'dateformat'
import { DATE_FORMAT } from './config'

export const toDateExpression = date => dateFormat(date, DATE_FORMAT)
