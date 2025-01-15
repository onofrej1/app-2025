import { TableData } from '@/components/table/table';
import { Button } from '@/components/ui/button';
import { Resource } from '@/resources/resources.types';

const event: Resource = {
  name: 'Event',
  name_plural: 'Events',
  model: 'event',
  resource: 'events',
  rules: 'CreateOrEditEvent',
  group: 'Events',
  menuIcon: '',
  renderForm: ({ fields, formState }) => {
    return (
      <div className='flex flex-col gap-4'>
        {fields.name}
        {fields.description}
        {fields.status}
        {fields.color}
        {fields.contact}
        {fields.location}
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
        {fields.venueId}
        {fields.organizerId}
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
    { name: 'contact', type: 'text', label: 'Contact' },
    { name: 'location', type: 'text', label: 'Location' },
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
    {
      name: 'venueId', 
      type: 'fk',
      relation: 'venue',
      label: 'Venue',
      resource: 'venue',
      textField: 'location'
    },
    {
      name: 'organizerId', 
      type: 'fk',
      relation: 'organizer',
      label: 'Organizer',
      resource: 'organizer',
      textField: 'name'
    },    
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'name', header: 'Name' },
    { name: 'description', header: 'Description' },
    { name: 'startDate', header: 'Start date', render: (row: TableData) => <span>{new Date(row.startDate).toLocaleDateString()}</span> },
    { name: 'endDate', header: 'End date', render: (row: TableData) => <span>{new Date(row.endDate).toLocaleDateString()}</span> },
    { name: 'status', header: 'Status', render: (row: TableData) => <span>{row.status}</span> },
  ],
};
export { event };