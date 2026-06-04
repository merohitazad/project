import { useEffect, useRef } from "react";
import { Form, redirect, useActionData, useNavigate } from "react-router-dom";
import { postListActions } from "../store/postListSlice";
import { useDispatch } from "react-redux";

function CreatePost() {
  const actionData = useActionData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (actionData) {
      dispatch(postListActions.addPost(actionData));
      navigate("/");
    }
  }, [actionData]);

  return (
    <Form method="POST" className="create-post">
      <div className="mb-2">
        <label htmlFor="userID" className="form-label">
          User ID
        </label>
        <input
          name="userId"
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
          name="title"
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
          name="body"
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
            name="reactions"
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
            name="tags"
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
    </Form>
  );
}

export async function createPostAction(data) {
  const formData = await data.request.formData();
  const postData = Object.fromEntries(formData);
  postData.tags = postData.tags.split(" ");

  const post = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  }).then((res) => res.json());
  
  return post;
}

export default CreatePost;
