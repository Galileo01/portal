import { Template } from '@/typings/database'

export type TemplateBase = Omit<Template, 'config'>

export type TemplateBaseList = Array<TemplateBase>
