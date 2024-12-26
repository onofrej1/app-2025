import { Resource } from '@/resources/resources.types';

const post: Resource = {
  name: 'Post',
  name_plural: 'Posts',
  model: 'post',
  resource: 'posts',
  rules: 'CreateOrEditPost',
  menuIcon: '',
  filter: [
    { name: 'title', type: 'text', label: 'Title' },
    //{ name: 'content', type: 'text', label: 'Content' },
    { name: 'content', type: 'select', className: 'w-60', label: 'Content', options: [
      {
        label: 'All',
        value: 'all'
      },
      {
        label: 'first',
        value: 'first'
      },
      {
        label: 'sedond',
        value: 'second'
      }
    ]},
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'content', type: 'text', label: 'Content' },
    {
      name: 'authorId', 
      type: 'fk',
      relation: 'author',
      label: 'Author',
      resource: 'user',
      textField: 'name'
    },
    {
      name: 'categories', 
      type: 'm2m',
      label: 'Categories',
      resource: 'category',
      textField: 'name'
    }
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'title', header: 'Title' },
    { 
      name: 'content', 
      header: 'Content', 
      renderRow: 'contentRow',
    },
  ],
};
export { post };