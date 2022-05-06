import { Page } from '@/typings/database'

export type PageBase = Omit<Page, 'config'>

export type PageBaseList = Array<PageBase>
