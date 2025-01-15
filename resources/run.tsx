import { TableData } from '@/components/table/table';
import { Resource } from '@/resources/resources.types';
import { Event } from '@prisma/client';

const run: Resource = {
  name: 'Run',
  name_plural: 'Runs',
  model: 'run',
  resource: 'runs',
  relations: ['event'],
  rules: 'CreateOrEditRun',
  menuIcon: '',
  group: 'Manage runs',
  filter: [
    //{ name: 'content', type: 'text', label: 'Content' },
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'distance', type: 'number', label: 'Distance' },
    { name: 'price', type: 'nubmer', label: 'Price [eur]' },    
    { name: 'elevation', type: 'text', label: 'Elevation' },
    { name: 'surface', type: 'text', label: 'Surface' },
    {
      name: 'eventId', 
      type: 'fk',
      relation: 'event',
      label: 'Event',
      resource: 'event',
      textField: 'name'
    },
    {
      name: 'runCategories', 
      type: 'm2m',
      label: 'Categories',
      resource: 'runCategory',
      textField: 'category'
    }  
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'event', header: 'Event', render: (row: TableData) => <span>{row.event.name}</span> },
    { name: 'title', header: 'Title' },
    { name: 'distance', header: 'Distance', render: (row: TableData) => <span>{row.distance} km</span> },
  ],
};
export { run };