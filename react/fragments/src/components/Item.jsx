import styles from "./Item.module.css";

const Item = ({ foodItem, handleBuyButton, bought }) => {
  
  return (
    <li className={`list-group-item ${styles["item"]} ${bought && "active"}`}>
      {foodItem}
      <button
        className={`btn btn-success ${styles.buyButton}`}
        onClick={handleBuyButton}
      >
        Buy
      </button>
    </li>
  );
};

export default Item;
