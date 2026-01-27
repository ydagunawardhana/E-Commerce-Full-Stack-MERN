import React from "react";
import QuantityBox from "../QuantityBox";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Button, Rating } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { MyContext } from "../../App";
import { useContext } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";

// ProductDetails Dialog Box Functions
const ProductDialogBox = (props) => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const context = useContext(MyContext);
  const product = props.data;
  const [isAdded, setIsAdded] = useState(false);

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const addToMyList = (id) => {
    if (context?.isLogin === true) {
      const data = {
        productTitle: product?.name,
        image: product?.images[0],
        rating: product?.rating,
        price: product?.price,
        oldPrice: product?.oldPrice,
        brand: product?.brand,
        discount: product?.discount,
        productId: product?._id,
      };

      postData(`/api/myList/add`, data).then((res) => {
        if (res.status !== false) {
          context.openAlertBox("success", "Product added to My List!");

          setIsAdded(true);

          if (context.setMyListCount)
            context.setMyListCount(context.myListCount + 1);
        } else {
          context.openAlertBox("error", res.message);
        }
      });
    } else {
      context?.openAlertBox("error", "Please Login to continue");
    }
  };

  useEffect(() => {
    if (context?.isLogin && product?._id) {
      fetchDataFromApi(`/api/myList`).then((res) => {
        let myList = [];

        if (Array.isArray(res)) {
          myList = res;
        } else if (res && Array.isArray(res.data)) {
          myList = res.data;
        } else if (res && Array.isArray(res.products)) {
          myList = res.products;
        }

        if (myList.length > 0) {
          const exists = myList.some((item) => {
            const itemId =
              typeof item.productId === "object"
                ? item.productId?._id
                : item.productId;
            return itemId === product._id;
          });

          if (exists) {
            setIsAdded(true);
          }
        }
      });
    }
  }, [product, context?.isLogin]);

  const addToCart = (id) => {
    if (context.isLogin === true) {
      let selectedSize = null;
      if (product?.size?.length > 0) {
        if (productActionIndex === null) {
          context.openAlertBox("error", "Please select a size!");
          return;
        }
        selectedSize = product.size[productActionIndex];
      }
      setLoading(true);
      const data = {
        productId: id,
        quantity: qty,
        size: selectedSize,
      };

      console.log("Sending to Backend:", data);

      postData(`/api/cart/add`, data).then((res) => {
        if (res.success === true) {
          context.openAlertBox("success", "Item Added to Cart!");
          context.getCartData();
          context.setOpenCartPanel(true);

          setIsAddedToCart(true);
        } else {
          context.openAlertBox("error", res.message);
        }
        setLoading(false);
      });
    } else {
      context.openAlertBox("error", "Please Login to continue");
    }
  };

  useEffect(() => {
    if (context.cartItems?.length > 0 && product?._id) {
      const isExist = context.cartItems.find(
        (item) =>
          item.productId === product._id || item.productId?._id === product._id
      );

      if (isExist) {
        setIsAddedToCart(true);
      } else {
        setIsAddedToCart(false);
      }
    } else {
      setIsAddedToCart(false);
    }
  }, [context.cartItems, product]);

  return (
    <>
      {/*-- Product Details --*/}
      <h1 className="text-[23px] font-[600] mb-2">{product?.name}</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-700 text-[14px]">
          Brands :{" "}
          <span className="font-[500] text-[#000] opacity-75">
            {product?.brand || "No Brand"}
          </span>
        </span>

        <Rating
          name="size-small"
          value={Number(product?.rating) || 0}
          size="small"
          readOnly
        />
        <span className="text-[14px] cursor-pointer">Review (5)</span>
      </div>

      {/*-- Price Details --*/}
      <div className="flex items-center gap-5 mt-5">
        {product?.oldPrice > 0 && (
          <span className="oldPrice line-through text-gray-500 text-[20px] font-[600]">
            ${product?.oldPrice}
          </span>
        )}
        <span className="price text-[#ff5252] text-[20px] font-[600]">
          ${product?.price}
        </span>

        <span className="text-[14px]">
          Available In Stock:{" "}
          <span
            className={`font-bold ${
              product?.countInStock > 0
                ? "text-[rgb(22,163,74)]"
                : "text-red-500"
            }`}
          >
            {product?.countInStock > 0
              ? `${product?.countInStock} Items`
              : "Out of Stock"}
          </span>
        </span>
      </div>

      <p className="mt-3 pr-10 mb-5">
        {product?.description?.substring(0, 200)}...
      </p>

      {/*-- Size Buttons--*/}
      {product?.category?.toLowerCase() === "fashion" &&
        product?.size?.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-[500] mt-2">SIZE:</span>
            <div className="flex items-center gap-2 mt-2">
              {product?.size?.map((s, index) => (
                <Button
                  key={index}
                  className={`product-size-btn !font-[600] ${
                    productActionIndex === index
                      ? "!bg-[#ff5252] !text-[#fff]"
                      : "!text-[#000000b3]"
                  }`}
                  onClick={() => setProductActionIndex(index)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}

      <div className="text-[15px] mt-6 mb-5">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </div>

      {/*-- Quantity Button--*/}
      <div className="flex item-center gap-4">
        <div className="quantityBoxWrapper w-[70px]">
          <QuantityBox quantity={qty} selectedVal={setQty} />
        </div>

        <Button
          className={`flex gap-2 ${
            isAddedToCart ? "!bg-[#ff5252] !text-white !border-none" : "btn-org"
          }`}
          onClick={() => addToCart(product?._id)}
          disabled={loading || product?.countInStock === 0}
        >
          {isAddedToCart ? (
            <>
              <FaCheck className="text-[20px]" />
              ADDED
            </>
          ) : (
            <>
              <MdOutlineShoppingCart className="text-[22px]" />
              {loading
                ? "Adding..."
                : product?.countInStock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </>
          )}
        </Button>
      </div>

      {/*-- Wishlist & Compare Button--*/}
      <div className="flex items-center gap-4 mt-6 ">
        <span
          className={`flex items-center gap-2 text-[16px] link cursor-pointer font-[550] 
          transition-all 
            ${isAdded ? "text-[#ff5252]" : "hover:text-[#ff5252]"}`}
          onClick={() => !isAdded && addToMyList(product?._id)}
        >
          {isAdded ? (
            <FaHeart className="text-[18px]" />
          ) : (
            <FaRegHeart className="text-[18px]" />
          )}

          {isAdded ? "Added to Wishlist" : "Add to Wishlist"}
        </span>
      </div>
    </>
  );
};

export default ProductDialogBox;
