import { Resource } from '@/resources/resources.types';

const organizer: Resource = {
    name: 'Organizer',
    name_plural: 'Organizers',
    model: 'organizer',
    resource: 'organizers',
    filter: [],
    menuIcon: '',
    group: 'Events',
    rules: 'CreateOrEditOrganizer',    
    form: [
        { name: 'name', type: 'text', label: 'Name' },
    ],
    list: [
        { name: 'name', header: 'Name' },
    ],
};
export { organizer };