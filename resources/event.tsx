import { Button } from '@/components/ui/button';
import { Resource } from '@/resources/resources.types';

const event: Resource = {
  name: 'Event',
  name_plural: 'Events',
  model: 'event',
  resource: 'events',
  rules: 'CreateOrEditEvent',
  menuIcon: '',
  renderForm: ({ fields, formState }) => {
    return (
      <div className='flex flex-col gap-4'>
        {fields.name}
        {fields.description}
        {fields.status}
        {fields.color}
        {fields.venue}
        <div className='flex'>
          <div className='flex-1'>
            {fields.startDate}
          </div>
          <div className='flex-1'>
            {fields.endDate}
          </div>
        </div>
        {fields.maxAttendees}
        {fields.createdById}
        <Button type="submit">Save</Button>
      </div>
    );
  },
  filter: [    
  ],
  form: [
    { name: 'name', type: 'text', label: 'Name' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'status', type: 'text', label: 'Status' },
    { name: 'color', type: 'text', label: 'Color' },
    { name: 'venue', type: 'text', label: 'Venue' },
    { name: 'maxAttendees', type: 'number', label: 'Max attendees' },
    { name: 'startDate', type: 'datepicker', label: 'Start date' },
    { name: 'endDate', type: 'datepicker', label: 'End date' },
    {
      name: 'createdById', 
      type: 'fk',
      relation: 'createdBy',
      label: 'User',
      resource: 'user',
      textField: 'name'
    },    
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'name', header: 'Name' },
    { name: 'description', header: 'Description' },
    { name: 'status', header: 'Status' },
  ],
};
export { event };