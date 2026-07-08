export type Brand<K, T> = K & { readonly __brand: T };

export type ProjectId = Brand<string, 'ProjectId'>;
export type PageId = Brand<string, 'PageId'>;
export type NodeId = Brand<string, 'NodeId'>;

export const asProjectId = (id: string): ProjectId => id as ProjectId;
export const asPageId = (id: string): PageId => id as PageId;
export const asNodeId = (id: string): NodeId => id as NodeId;