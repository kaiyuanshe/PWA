import { BaseData, CollectionModel } from 'mobx-strapi';

export interface Category extends BaseData {
    name: string;
    summary?: string;
}

export class CategoryModel extends CollectionModel<Category> {
    name = 'category';
    basePath = 'categories';
}
