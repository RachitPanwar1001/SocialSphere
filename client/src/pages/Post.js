import React, { useContext, useEffect  , useState} from 'react'
import {useParams} from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
    let {id} = useParams();
    const [postObject , setPostObject] = useState({})
    const [comments , setComments] = useState([])
    const [newComment , setNewComment] = useState("");
    const { authState} = useContext(AuthContext);


    useEffect(()=>{
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response)=>{
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response)=>{
            setComments(response.data);
        });
    } , []);

    const addComment =  ()=>{
        axios.post(`http://localhost:3001/comments` , 
            {commentBody: newComment, PostId: id},
            {
                headers: {
                    accessToken : localStorage.getItem("accessToken")
                }
            }
        )
        .then((response)=>{
            if(response.data.error){
                alert(response.data.error);
            }
            else{
                const commentToAdd = {commentBody : newComment , userName : response.data.userName}
            
                setComments([...comments , commentToAdd] );
                setNewComment("");
            }
        });

    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}` ,{headers :  {
            accessToken : localStorage.getItem("accessToken")
        }
    } ).then(()=>{
            setComments(comments.filter((val)=>{
                return val.id != id
            }))
        });
    }
    return (
        <div className='postPage'>
            <div className='leftSide'>
                <div className='post' id='individual'>
                    <div className="title">{postObject.title}</div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">{postObject.userName}</div>
                </div>
            </div>
            <div className='rightSide'>
                <div className="addCommentContainer">
                    <input type="text" placeholder='write Comment' onChange={(event)=>{
                        setNewComment(event.target.value);
                    }} value = {newComment}/>
                    <button onClick={addComment}> Add Commment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment)=>{
                        return(
                            <div key = {comment.id} className='comment'>
                                {comment.commentBody}
                                <label > Username : {comment.userName}</label>
                                {authState.userName === comment.userName &&<button onClick={()=>{deleteComment(comment.id)}}> X</button>}
                            </div>
                        )
                    })}
                </div>
            </div>
            
        </div>
  )
}

export default Post
