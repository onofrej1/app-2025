import { Resource } from '@/resources/resources.types';

const venue: Resource = {
    name: 'Venue',
    name_plural: 'Venues',
    model: 'venue',
    resource: 'venues',
    filter: [],
    menuIcon: '',
    group: 'Manage runs',
    rules: 'CreateOrEditVenue',    
    form: [
        { name: 'location', type: 'text', label: 'Location' },
    ],
    list: [
        { name: 'location', header: 'Location' },
    ],
};
export { venue };