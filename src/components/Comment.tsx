import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import type { Post, User, Comment } from '@prisma/client'

export type CommentProps = Comment & {
    postId: number;
    userId: number;
  }

function Comment ({postId, userId}: CommentProps) {
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

    const handleAddComment = async (e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault()
        try {
            const response = await axios.post(`/api/comment/${postId}`,{
                commentContent: newComment,
                userId: userId,
            });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error('Error adding comment', error)
        }
    };

    const handleDeleteComment = async (commentId: number) =>{
        try {
            await axios.delete(`/api/comment/${postId}`,{
                data: {commentId},
            })
            const updatedComments = comments.filter((comment)=> comment.id !== commentId)
            setComments(updatedComments)
        } catch (error) {
            console.error('Error deleting comment',error)
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
                        <p>Author : {comment.user.name}</p>
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
