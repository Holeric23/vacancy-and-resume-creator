import { PageId } from './identifiers.ts';
import { Page } from './page.ts';

export interface Document {
  id: string;
  title: string;
  pagesById: Record<PageId, Page>;
  pageOrder: PageId[];
}