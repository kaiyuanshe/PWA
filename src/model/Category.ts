import { CollectionModel } from './service';

export interface Category extends BaseData {
    name: string;
    summary?: string;
}

export class CategoryModel extends CollectionModel<Category> {
    name = 'category';
    baseURI = 'categories';
}
