import { Resource } from '@/resources/resources.types';

const tag: Resource = {
    name: 'Tag',
    name_plural: 'Tags',
    model: 'tag',
    resource: 'tags',
    group: 'Blog',
    filter: [],
    menuIcon: '',
    rules: 'CreateOrEditTag',    
    form: [
        { name: 'title', type: 'text', label: 'Title' },
    ],
    list: [
        { name: 'title', header: 'Title' },
    ],
};
export { tag };