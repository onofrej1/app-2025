import { Resource } from '@/resources/resources.types';

const task: Resource = {
  name: 'Task',
  name_plural: 'Tasks',
  model: 'task',
  resource: 'tasks',
  rules: 'CreateOrEditTask',
  menuIcon: '',
  filter: [    
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'status', type: 'text', label: 'Status' },
    { name: 'order', type: 'number', label: 'Order' },
    { name: 'deadline', type: 'datepicker', label: 'Deadline' },
    {
      name: 'userId', 
      type: 'fk',
      relation: 'user',
      label: 'User',
      resource: 'user',
      textField: 'name'
    },    
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'title', header: 'Title' },
    { name: 'description', header: 'Description' },
    { name: 'status', header: 'Status' },
  ],
};
export { task };