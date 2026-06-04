import { useContext } from "react";
import Post from "./Post";
import { PostListContext } from "../store/PostList-Store";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";

const PostLists = () => {
  const { postListArray, fetching } = useContext(PostListContext);

  if (fetching) {
    return <LoadingSpinner />;
  } else if (!fetching && postListArray.length === 0) {
    return <WelcomeMessage />;
  } else
    return (
      <div className="post-list">
        {postListArray.map((post) => (
          <Post key={post.id} post={post}></Post>
        ))}
      </div>
    );
};

export default PostLists;
