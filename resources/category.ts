import { Resource } from '@/resources/resources.types';

const category: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: 'category',
    resource: 'categories',
    group: 'Blog',
    filter: [],
    menuIcon: '',
    rules: 'CreateOrEditCategory',    
    form: [
        { name: 'title', type: 'text', label: 'Title' },
    ],
    list: [
        { name: 'title', header: 'Title' },
    ],
};
export { category };