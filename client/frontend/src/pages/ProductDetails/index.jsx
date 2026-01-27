import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ProductZoom from "../../components/ProductZoom";
import { Button, Rating } from "@mui/material";

import TextField from "@mui/material/TextField";
import ProductsSlider from "../../components/ProductsSlider";
import Link from "@mui/material/Link";
import ProductDialogBox from "../../components/ProductDialogBox";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../../App";

// ProductDetails Page Functions
const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  const context = useContext(MyContext);

  // Review Form States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const fetchProductData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/products/${id}`);
      const data = res.data;
      // Image URL fix logic
      if (data.images && data.images.length > 0) {
        data.images = data.images.map((img) =>
          img.startsWith("http") ? img : `http://localhost:8000${img}`
        );
      }
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    axios.get("http://localhost:8000/api/products").then((res) => {
      const fixedProducts = res.data.map((item) => {
        if (item.images) {
          item.images = item.images.map((img) =>
            img.startsWith("http") ? img : `http://localhost:8000${img}`
          );
        }
        return item;
      });
      setProducts(fixedProducts);
    });

    fetchProductData();
  }, [id]);

  // Review Submit
  const submitReviewHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accesstoken");

    console.log("Token Found:", token);

    if (!token) {
      context.openAlertBox("error", "Please login to submit a review");
      return;
    }

    if (rating === 0 || comment.trim() === "") {
      context.openAlertBox("error", "Please provide both rating and comment");
      return;
    }

    try {
      setLoadingReview(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `http://localhost:8000/api/products/${id}/reviews`,
        { rating, comment },
        config
      );

      context.openAlertBox("success", "Review Submitted Successfully!");
      setRating(0);
      setComment("");
      fetchProductData();
    } catch (error) {
      context.openAlertBox(
        "error",
        error.response?.data?.message || "Error submitting review"
      );
    } finally {
      setLoadingReview(false);
    }
  };

  const relatedProducts = products.filter(
    (item) =>
      product && item.category === product.category && item._id !== product._id
  );

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <div className="py-4">
        <div className="container">
          {/*-- ProductDetalis Page TOP Function --*/}
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !font-[600]"
            >
              Home
            </Link>

            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !font-[600]"
            >
              {product?.category}
            </Link>

            <Link
              underline="hover"
              color="inherit"
              className="link transition !font-[600]"
            >
              {product?.name}
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      {/*-- ProductZoom Functions --*/}
      <section className="bg-[#fff] py-6 px-40">
        <div className="container flex gap-8 items-center">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom images={product?.images} />
          </div>

          {/*-- Product Details Functions --*/}
          <div className="productContent w-[60%] pr-10 pl-10">
            <ProductDialogBox data={product} />
          </div>
        </div>

        {/*-- Details/ Description/ Reviews Section Buttons--*/}
        <div className="containere pt-9">
          <div className="flex items-center gap-8 mb-3">
            <span
              className={`link text-[18px] cursor-pointer font-[600] ${
                activeTab === 0 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>

            <span
              className={`link text-[18px] cursor-pointer font-[600] ${
                activeTab === 1 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Product Details
            </span>

            <span
              className={`link text-[18px] cursor-pointer font-[600] ${
                activeTab === 2 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(2)}
            >
              Reviews ({product.numReviews})
            </span>
          </div>

          {/*-- Description Section --*/}
          {activeTab === 0 && (
            <div className="shadow-md w-full p-8 pt-1 px-8 pb-6 rounded-md">
              <p>{product?.description}</p>

              <h5>Free Shippping & Return</h5>
            </div>
          )}

          {/*-- Details Section --*/}
          {activeTab === 1 && (
            <div className="shadow-md w-full p-6 py-1 px-8 rounded-md">
              <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                <table class="w-full text-sm text-left rtl:text-right text-body">
                  <thead class="text-[14px] text-[600] bg-neutral-secondary-soft border-b rounded-base border-default">
                    <tr>
                      <th className="px-6 py-3 font-[700]">Brand</th>
                      <th className="px-6 py-3 font-[700]">Category</th>
                      <th className="px-6 py-3 font-[700]">Price</th>
                      <th className="px-6 py-3 font-[700]">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-[#fff]">
                      <td className="px-6 py-4">{product?.brand}</td>
                      <td className="px-6 py-4">{product?.category}</td>
                      <td className="px-6 py-4">${product?.price}</td>
                      <td className="px-6 py-4">{product?.countInStock}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/*-- Review Section --*/}
          {activeTab === 2 && (
            <div className="shadow-md w-[80%] p-6 py-1 px-8 rounded-md pb-5">
              <div className="w-full productReviewContainer">
                <h2 className="text-[18px] mt-2">Customer Reviews</h2>

                <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                  {product.reviews.length === 0 && (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}

                  {product.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="review pb-5 pt-5 border-b border-[#00000050] w-full flex items-center justify-between"
                    >
                      <div className="info w-[60%] flex items-center gap-4">
                        <div className="img w-[60px] h-[60px] overflow-hidden rounded-full flex items-center justify-center bg-gray-200">
                          <FaUserCircle size={40} className="text-gray-400" />
                        </div>
                        <div className="w-[80%]">
                          <h4 className="text-[16px] font-bold">{rev.name}</h4>
                          <h3 className="text-[12px] text-gray-500 mb-0">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </h3>
                          <p className="text-[13px] mt-1 text-gray-700">
                            {rev.comment}
                          </p>
                        </div>
                      </div>
                      <Rating
                        name="read-only"
                        value={rev.rating}
                        readOnly
                        size="small"
                      />
                    </div>
                  ))}
                </div>

                {/*  Add Review Form*/}
                <br />
                <div className="reviewForm bg-[#fafafa] p-4 rounded-md">
                  <h2 className="text-[18px]">Write a Customer Review</h2>
                  <form className="w-full mt-5" onSubmit={submitReviewHandler}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                      />
                    </div>

                    <TextField
                      id="outlined-multiline-flexible"
                      label="Comment"
                      className="w-full"
                      multiline
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                    />

                    <div className="flex items-center mt-5">
                      <Button
                        type="submit"
                        className="btn-org !bg-[#ff5252] !text-white !px-6 !py-2 
                        !capitalize"
                        disabled={loadingReview}
                      >
                        {loadingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container pt-8">
          <h2 className="text-[22px] font-[600] pb-0">Related Products</h2>
          {relatedProducts.length > 0 ? (
            <ProductsSlider items={6} products={relatedProducts} />
          ) : (
            <p className="text-gray-500 mt-5">
              No related products found in this category.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
