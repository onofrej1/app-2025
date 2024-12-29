//import { metadata } from '@/content/first.mdx';

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    //console.log(metadata);
    const slug = (await params).slug
    const { default: Post } = await import(`@/content/${slug}.mdx`)
   
    return <Post />
  }
   
  export function generateStaticParams() {
    return [{ slug: 'first' }, { slug: 'second' }]
  }
   
  export const dynamicParams = false