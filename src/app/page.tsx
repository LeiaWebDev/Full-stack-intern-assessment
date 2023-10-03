import prisma from "../lib/prisma"
import { PrismaClient, Prisma } from '@prisma/client'
import { User } from "@prisma/client"
import Post from "../components/Post"
import Comment from "../components/Comment"
import Header from "../components/Header"
import user from "../pages/api/user"
import { isDate } from "util/types"
// import type { Comment } from '@prisma/client'

async function Home() {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  
  
  return (
    <>
      {feed.map((post) => (
        <div key={post.id}>
          <Post post={post} />
          <Comment 
            post={{
              id: 0,
              createdAt: new Date,
              updatedAt: new Date,
              title: "",
              content: null,
              published: false,
              viewCount: 0,
              authorId: null
              
            }}
            
            user={{
              id: 0,
              email: "",
              name: null
            }}
            id={0}
            createdAt={new Date} 
            commentContent={""}
            postId={0}
            userId={0} 
            />
          {/* <Comment 
            postId={post.id} 
            userId={user.id} 
            id={comment.id} 
            createdAt={comment.createdAt} 
            commentContent={comment.commentContent}/> */}
        </div>
      ))}
      
    </>
  )
}
export default Home;
