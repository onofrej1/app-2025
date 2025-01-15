import { Resource } from '@/resources/resources.types';

const runCategory: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: 'runCategory',
    resource: 'runCategories',
    filter: [],
    menuIcon: '',
    group: 'Manage runs',
    rules: 'CreateOrEditRunCategory',    
    form: [
        { name: 'category', type: 'text', label: 'Category' },
        { name: 'title', type: 'text', label: 'Title' },
    ],
    list: [
        { name: 'category', header: 'Category' },
        { name: 'title', header: 'Title' },
    ],
};
export { runCategory };