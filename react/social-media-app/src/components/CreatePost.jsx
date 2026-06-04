import { useRef } from "react";
import { useContext } from "react";
import { PostListContext } from "../store/PostList-Store";

function CreatePost() {
  const { addPost } = useContext(PostListContext);

  const userId = useRef();
  const postTitle = useRef();
  const postBody = useRef();
  const reactions = useRef();
  const tags = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      userId: userId.current.value,
      title: postTitle.current.value,
      body: postBody.current.value,
      tags: tags.current.value.split(" "),
      reactions: reactions.current.value,
    };

    fetch("https://dummyjson.com/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId.current.value,
        title: postTitle.current.value,
        body: postBody.current.value,
        tags: tags.current.value.split(" "),
        reactions: reactions.current.value,
      }),
    })
      .then((res) => res.json())
      .then((post) => addPost(post));

    userId.current.value = "";
    postTitle.current.value = "";
    postBody.current.value = "";
    tags.current.value = "";
    reactions.current.value = "";
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="userID" className="form-label">
          User ID
        </label>
        <input
          ref={userId}
          type="text"
          className="form-control create-post-input"
          id="userID"
          placeholder="Your user id"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="title" className="form-label">
          Post Title
        </label>
        <input
          ref={postTitle}
          type="text"
          className="form-control create-post-input"
          id="title"
          placeholder="Write your post title here"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="body" className="form-label">
          Post Content
        </label>
        <textarea
          ref={postBody}
          className="form-control create-post-input"
          id="body"
          rows="3"
          placeholder="Tell us more about it"
        />
        <div className="mb-2">
          <label htmlFor="reaction" className="form-label">
            Reactions
          </label>
          <input
            ref={reactions}
            type="text"
            className="form-control create-post-input"
            id="reaction"
            placeholder="Number of reactions"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="tags" className="form-label ">
            Tags
          </label>
          <input
            ref={tags}
            type="text"
            className="form-control create-post-input"
            id="tags"
            placeholder="Please enter tags using space"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </form>
  );
}
export default CreatePost;
