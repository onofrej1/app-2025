import { Resource } from '@/resources/resources.types';

const run: Resource = {
  name: 'Run',
  name_plural: 'Runs',
  model: 'run',
  resource: 'runs',
  rules: 'CreateOrEditRun',
  menuIcon: '',
  group: 'Manage runs',
  filter: [
    //{ name: 'content', type: 'text', label: 'Content' },
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'distance', type: 'number', label: 'Distance' },
    { name: 'price', type: 'nubmer', label: 'Price' },
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
    { name: 'title', header: 'Title' },
    { name: 'distance', header: 'Distance' },
  ],
};
export { run };