import { Resource } from '@/resources/resources.types';

const post: Resource = {
  name: 'Post',
  name_plural: 'Posts',
  model: 'post',
  resource: 'posts',
  rules: 'CreateOrEditPost',
  group: 'Blog',
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
    { name: 'content', type: 'richtext', label: 'Content' },
    { name: 'status', type: 'text', label: 'Status' },
    {
      name: 'authorId', 
      type: 'fk',
      relation: 'author',
      label: 'Author',
      resource: 'user',
      renderLabel: (row: any) => `${row.lastName} ${row.firstName}`,
    },
    /*{
      name: 'categoryId', 
      type: 'fk',
      relation: 'category',
      label: 'Category',
      resource: 'category',
      textField: 'title'
    },*/
    {
      name: 'categories', 
      type: 'm2m',
      label: 'Categories',
      resource: 'category',
      textField: 'title'
    },
    {
      name: 'tags', 
      type: 'm2m',
      label: 'Tags',
      resource: 'tag',
      textField: 'title'
    }
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'title', header: 'Title' },
    /*{ 
      name: 'content', 
      header: 'Content', 
    },*/
  ],
};
export { post };