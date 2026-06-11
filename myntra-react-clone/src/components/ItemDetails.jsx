import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { addBagItemToServer, deleteBagItemFromServer } from "../services/bagService";
import { bagActions } from "../store/bagSlice";
import { useParams, Link } from "react-router-dom"; // Fixed: Imported Link for the 404 block
import { getItemDetailsFromServer } from "../services/itemService";
import LoadingSpinner from "./LoadingSpinner";

const ItemDetails = () => {
  const [item, setItem] = useState(null);
  
  const { id } = useParams();
  const itemId = id; 
  const dispatch = useDispatch();

  const bag = useSelector(store => store.bag);
  const exists = item && item !== "not-found" ? bag.some(id => id === item.id) : false;

  useEffect(() => {
    const loadItemData = async () => {
      try {
        const data = await getItemDetailsFromServer(itemId);
        if (!data) {
          setItem("not-found");
          console.warn(`No details found for item ID: ${itemId}`);
        } else {
          setItem(data);
          console.log("Fetched item details:", data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load product details:", error);
        }
      }
    };

    loadItemData();
    return () => {
      controller.abort();
    };
  }, [itemId]);

  const handleAddToBag = (id) => {
    dispatch(bagActions.addBagItems(id));
    return addBagItemToServer(id)
      .catch((error) => {
        console.error("Failed to add item to bag:", error);
        dispatch(bagActions.removeFromBag(id));
      }); 
  };

  const handleRemoveFromBag = (id) => {
    dispatch(bagActions.removeFromBag(id));
    return deleteBagItemFromServer(id)
      .catch((error) => {
        console.error("Failed to remove item from bag:", error);
        dispatch(bagActions.addBagItems(id));
      });
  };

  const handleBagAction = async () => {
    if (!item || item === "not-found") return;
    try {
      if (exists) {
        await handleRemoveFromBag(item.id);
      } else {
        await handleAddToBag(item.id);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const styles = {
    card: {
      maxWidth: "720px", 
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #f3f4f6",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "row", 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: "40px auto",
    },
    imageContainer: {
      position: "relative",
      width: "45%", 
      backgroundColor: "#fbfbfb",
      minHeight: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    ratingBadge: {
      position: "absolute",
      bottom: "16px",
      left: "16px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(4px)",
      padding: "6px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#1f2937",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      zIndex: 10
    },
    star: {
      color: "#f59e0b",
      fontSize: "14px",
    },
    dividerPipe: {
      color: "#d1d5db",
      fontWeight: "400",
    },
    count: {
      color: "#6b7280",
      fontWeight: "400",
    },
    infoSection: {
      padding: "28px", 
      width: "55%", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", 
    },
    company: {
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: "800",
      color: "#4b5563",
      marginBottom: "6px",
    },
    itemName: {
      fontSize: "18px", 
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 12px 0",
      lineHeight: "1.4",
    },
    priceRow: {
      display: "flex",
      alignItems: "baseline",
      gap: "10px",
      marginBottom: "20px",
    },
    currentPrice: {
      fontSize: "22px", 
      fontWeight: "700",
      color: "#111827",
    },
    originalPrice: {
      fontSize: "14px",
      color: "#9ca3af",
      textDecoration: "line-through",
    },
    discount: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#059669",
    },
    metaGrid: {
      borderTop: "1px solid #f3f4f6",
      paddingTop: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "20px",
    },
    metaRow: {
      display: "flex",
      justifyContent: "space-between",
    },
    metaValue: {
      fontWeight: "500",
      color: "#1f2937",
    },
    returnVal: {
      fontWeight: "500",
      color: "#059669",
    },
    button: {
      width: "100%",
      height: "44px",
      padding: "12px 0",
      borderRadius: "8px",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      border: "1px solid transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.15s ease-in-out",
      backgroundColor: exists ? "#ee5050" : "#38b61e",
      color: "#ffffff",
      borderColor: exists ? "#eb0e28" : "transparent",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }
  };
  
  if (!item) {
    return <LoadingSpinner />;
  } 

  if (item === "not-found") {
    return ( 
      <div className="d-flex align-items-center justify-content-center bg-light px-3" style={{ minHeight: "70vh" }}>
        <div className="w-100 text-center p-5 mt-4 rounded-4 bg-white shadow" style={{ maxWidth: "450px" }}>
          <div className="display-1 fw-bold text-danger">404</div>
          <h1 className="mt-3 h3 fw-semibold text-dark">
            Product Not Found
          </h1>
          <p className="mt-3 text-muted">
            Sorry, the product you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-4 btn btn-primary btn-lg px-4 fs-6 fw-medium"
          >
            Go Back Home
          </Link>
        </div>
      </div> 
    );
  }

  const product = item;
  const formattedCount = product.rating?.count >= 1000 
    ? `${(product.rating.count / 1000).toFixed(1)}k` 
    : product.rating?.count || 0;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img 
          src={product.image.startsWith('/') ? product.image : `/${product.image}`} 
          alt={product.item_name} 
          style={styles.image} 
        />
        <div style={styles.ratingBadge}>
          <span style={styles.star}>★</span>
          <span>{product.rating?.stars || 0}</span>
          <span style={styles.dividerPipe}>|</span>
          <span style={styles.count}>{formattedCount}</span>
        </div>
      </div>

      <div style={styles.infoSection}>
        <span style={styles.company}>{product.company}</span>
        <h1 style={styles.itemName}>{product.item_name}</h1>

        <div style={styles.priceRow}>
          <span style={styles.currentPrice}>₹{product.current_price}</span>
          <span style={styles.originalPrice}>₹{product.original_price}</span>
          <span style={styles.discount}>({product.discount_percentage}% OFF)</span>
        </div>

        <div style={styles.metaGrid}>
          <div style={styles.metaRow}>
            <span>Delivery by:</span>
            <span style={styles.metaValue}>{product.delivery_date}</span>
          </div>
          <div style={styles.metaRow}>
            <span>Return Policy:</span>
            <span style={styles.returnVal}>{product.return_period} days return</span>
          </div>
        </div>

        <button
          onClick={handleBagAction}
          disabled={!item}
          style={styles.button}
        >
          {exists ? "Remove from Bag" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;