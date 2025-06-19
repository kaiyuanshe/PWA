import { Category } from '@kaiyuanshe/data-server';

import { CollectionModel } from './service';

export class CategoryModel extends CollectionModel<Category> {
    name = 'category';
    baseURI = 'categories';
}
