import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import FoodItems from "./components/FoodItems";
import ErrorMessage from "./components/ErrorMessage";
import Container from "./components/container";
import FoodInput from "./components/FoodInput";
import { useState } from "react";

function App() {
  const [foodItems, setFoodItems] = useState(["Dal", "Roti", "Salad", "Milk"]);
  const [inputValue, setInputValue] = useState("");

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setFoodItems([...foodItems, inputValue]);
      setInputValue(""); 
    }
  };

  return (
    <Container>
      <h1 className="food-heading">Healthy Foods</h1>

      <FoodInput
        value={inputValue}
        handleOnChange={handleOnChange}
        handleKeyDown={handleKeyDown}
      />

      <ErrorMessage items={foodItems} />
      <FoodItems items={foodItems} />
    </Container>
  );
}

export default App;
