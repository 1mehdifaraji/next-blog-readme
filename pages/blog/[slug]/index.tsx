import React, { FC } from "react";
import fs from "fs";
import matter from "gray-matter";
import Markdown from "markdown-to-jsx";

interface BlogpageProps {}

const Blogpage: FC<any> = (props) => {
  return (
    <div>
      <div>Blog page</div>
      <Markdown>{props.blog.content}</Markdown>
    </div>
  );
};

const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

const getPostMetadata = () => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

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

export const getStaticProps = (ctx: any) => {
  const { slug } = ctx.params;

  const blog: any = getPostContent(slug);

  delete blog.orig;

  return {
    props: {
      blog,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  let paths: any = [];

  const posts = getPostMetadata();

  posts.forEach((post) => {
    paths.push({
      params: { slug: post.slug },
    });
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export default Blogpage;
