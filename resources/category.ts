import { Resource } from '@/resources/resources.types';

const category: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: 'category',
    resource: 'categories',
    filter: [],
    menuIcon: '',
    rules: 'CreateOrEditCategory',    
    form: [
        { name: 'name', type: 'text', label: 'Name' },
    ],
    list: [
        { name: 'name', header: 'Name' },
    ],
};
export { category };