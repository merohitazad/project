// import ItemImage from "../images/1.jpg"

import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { addBagItemToServer, deleteBagItemFromServer } from "../services/bagService";
import { Link } from "react-router";

const HomeItem = ({item}) => {
  const dispatch = useDispatch();
  const bag = useSelector(store => store.bag);
  const exists = bag.some(id => id === item.id);

  const handleAddToBag = () => {
    dispatch(bagActions.addBagItems(item.id));
    addBagItemToServer(item.id)
      .catch((error) => {
        console.error("Failed to add item to bag:", error);
      }); 
  }

  const handleRemoveFromBag = () => {
    dispatch(bagActions.removeFromBag(item.id));
    deleteBagItemFromServer(item.id)
      .catch((error) => {
        console.error("Failed to remove item from bag:", error);
      });
  }

  return (
    <div className="item-container">
      <Link to={`/items/${item.id}`} className="text-decoration-none text-reset">
        <img className="item-image" src={item.image} alt="item image" />
        <div className="rating">
          {item.rating.stars} ⭐ | {item.rating.count}
        </div>
        <div className="company-name">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount">({item.discount_percentage}% OFF)</span>
        </div>
      </Link>
      {exists ? <button className="btn-add-bag btn btn-danger" onClick={handleRemoveFromBag}>
        Remove from Bag
      </button> : <button className="btn-add-bag btn btn-success" onClick={handleAddToBag}>
        Add to Bag
      </button>}
    </div>
  );
};

export default HomeItem;
