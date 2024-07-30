import {
  GenericFunction,
  GenericPromiseFunction,
} from '@shared-library/types';

export interface GenericItem {
  id: string,
  name: string,
  icon?: string,
  description?: string,
  routerLink?: string | string[],
  href?: string,
  tooltip?: string,
  isSvgIcon?: boolean,
  disabled?: boolean,
  children?: GenericItem[],
  click?: GenericFunction | GenericPromiseFunction,
}