import prisma from "../lib/prisma"
import Post from "../components/Post"
import Comment from "../components/Comment"

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
        </div>
      ))}
      
      <Comment postId={post.id}/>
    </>
  )
}
export default Home;
