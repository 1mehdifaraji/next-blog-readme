import Link from "next/link";
import fs from "fs";
import React, { FC } from "react";
import matter from "gray-matter";

interface BlogsPageProps {}

const getPostMetadata = () => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`posts/${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      slug: fileName.replace(".md", ""),
    };
  });

  return posts;
};

const BlogsPage: FC<any> = (props) => {
  return (
    <div>
      <div>Blogs page</div>
      {props.posts.map((post: any) => {
        return (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div>{post.title}</div>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps = () => {
  const posts = getPostMetadata();
  return {
    props: {
      posts,
    },
    revalidate: 1,
  };
};

export default BlogsPage;
