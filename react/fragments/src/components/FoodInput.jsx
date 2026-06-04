import styles from "./FoodInput.module.css"

const FoodInput = ({ value, handleOnChange, handleKeyDown }) => {
  return (
    <input
      type="text"
      className={styles.foodInput}
      placeholder="Enter food item"
      value={value}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default FoodInput;
