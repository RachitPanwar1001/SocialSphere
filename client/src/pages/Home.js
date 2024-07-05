import React  from "react";
import axios from "axios";
import {useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts , setLikedPosts] = useState([]);
  let navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem("accessToken")){
      navigate("/login");
    }
    else{
      axios.get("http://localhost:3001/posts" ,{
        headers : {
          accessToken : localStorage.getItem("accessToken")
        }
      } ).then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map((Like)=>{
          return Like.PostId;
        }));
      });
    }
  }, []);


  const likeAPost = (postId) =>{
    axios.post("http://localhost:3001/likes" , {PostId : postId}  , {
      headers : {
        accessToken : localStorage.getItem("accessToken")
      }
    }).then((response)=>{
      setListOfPosts(listOfPosts.map((post)=>{
        if(post.id===postId){
          const likesArray = post.Likes;
          if(likesArray.length===0){
            return{...post , Likes: [0]}
          }
          if(response.data.liked){
            likesArray.push("0");
            return{...post , Likes: likesArray};
          }
          else{
            likesArray.pop();
            return{...post , Likes: likesArray};
          }
        }
        else{
          return post
        }
      }));
      if(likedPosts.includes(postId)){
        setLikedPosts(likedPosts.filter((id)=>{
          return id !== postId;
        }))
      }
      else{
        const lp = likedPosts;
        lp.push(postId);
        setLikedPosts(lp);
      }
    })
  }

  return (
    <div className="App">
      {listOfPosts.map((value, key) => {
        return (
          <div className="post" key={value.id} >
            <div className="title">{value.title}</div>
            <div className="body" onClick={()=>{
              navigate(`/post/${value.id}`)
            }}>
            {value.postText}
          </div>
            <div className="footer">
              <div className="username">{value.userName}</div>
              <div className="buttons">
                <button onClick = {()=>{likeAPost(value.id)}}>
                  {likedPosts.includes(value.id) ? <label>Unlike</label>: <label>Like</label> }
                </button>
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
