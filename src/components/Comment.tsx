'use client'
// import {useClient} from "react";
import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import type { Post, User } from '@prisma/client'
import type { Comment } from '@prisma/client'
import user from "../pages/api/user"
import { PrismaClient, Prisma } from '@prisma/client'

export type CommentProps = {
    post: {id: 0,
        createdAt: Date,
        updatedAt: Date,
        title: "",
        content: null,
        published: false,
        viewCount: 0,
        authorId: null},
    postId: number;
    user: {id: 0,
        email: "",
        name: null,}, 
    userId: number;
    id: number; 
    createdAt: Date; 
    commentContent: string; 
  } & Comment;

  
//const authorName = post.author ? post.author.name : 'Unknown author'
// const commentAuthor = comment.user ? comment.user.name : 'Unknown author'


// function Comment ({post, user}: {post, user: CommentProps}) {
    // { post }: { post: PostProps }
function Comment ({
    post, 
    postId, 
    user, 
    userId, 
    id, 
    commentContent}: CommentProps) {
     
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        // fetch comments for the current post 
        async function fetchComments() {
            try {
                setIsLoading(true)
                const response = await axios.get(`/api/comment/${postId}`)  
                setComments(response.data)   
            } catch (error) {
                console.error('Error fetching comments', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchComments()
    },[postId])

    // add comment to a specific blogpost
    const handleAddComment = async (e: React.SyntheticEvent) =>{
        e.preventDefault()
        try {
            console.log(newComment);
            const response = await axios.post(`/api/comment/${postId}`,{
                commentContent: newComment,
                user: user.name, 
                userId: userId,
                
            });
            console.log('API response:', response)
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error('Error adding comment', error)
        }
    };

    // delete a specific comment by Id to a blogpost
    const handleDeleteComment = async (commentId: number) =>{
        try {
            await axios.delete(`/api/comment/${postId}`,{
                data: {commentId},
            })
            const updatedComments = comments.filter((comment)=> comment.id !== commentId)
            setComments(updatedComments)
        } catch (error) {
            console.error('Error deleting comment', error)
        }
    }
  return (
    <div>
        <h2>Comments</h2>
        <ul>
            {isLoading ? (
                <p>Loading comments ...</p>
            ) : (
                comments.map((comment)=>(
                    <li key={comment.id}>
                        <p>{comment.commentContent}</p>
                        <p>Author : {comment.userId} {user.name}</p>
                        {/* <p>Author : {comment.user.username}</p> */}
                        
                        <button onClick={()=>handleDeleteComment(comment.id)}>Delete Comment</button>
                    </li>
                ))
            )}
        </ul>
        <textarea 
        value={newComment}
        onChange={(e)=> setNewComment(e.target.value)}
        placeholder='Add a comment...'
        />
        <button onClick={handleAddComment}>Add Comment</button>
        
    </div>
  )
}

export default Comment
