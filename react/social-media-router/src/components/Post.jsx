import { RxCross2 } from "react-icons/rx";
import { CiHeart } from "react-icons/ci";
import { useContext } from "react";
import { PostListContext } from "../store/PostList-Store";

const Post = ({post}) => {
  const { deletePost } = useContext(PostListContext);
  
  return <div className="post">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between">
            {post.title}
            <RxCross2 onClick={() => deletePost(post.id)} />
          </h5>
          <p className="card-text">{post.body}</p>
          {post.tags.map((tag) => (
            <span key={tag} className="badge text-bg-primary m-1">
              {tag}
            </span>
          ))}
          <div className="fs-2">
            <CiHeart />
            {typeof post.reactions === "string"
              ? post.reactions
              : post.reactions.likes}
          </div>
        </div>
      </div>
    </div>
}

export default Post;