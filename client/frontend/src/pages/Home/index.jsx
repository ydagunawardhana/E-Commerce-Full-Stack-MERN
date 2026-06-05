import React, { useContext, useEffect, useState } from "react";
import HomeSlider from "../../components/HomeSlider";
import HomeCategorySlider from "../../components/HomeCategorySlider";
import { FaShippingFast } from "react-icons/fa";
import AdsBannerSlider from "../../components/AdsBannerSlider";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductsSlider from "../../components/ProductsSlider";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import BlogItem from "../../components/BlogItem";
import HomeSliderV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/BannerBoxV2";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Home Page Function (All-Merge)
const Home = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [banners, setBanners] = useState([]);

useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // 1. Fetch Data
    axios.get(`${API_URL}/api/products`).then((res) => {
      setProducts(res.data);
    });

    axios.get(`${API_URL}/api/categories`).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setCategoryList(res.data);
      }
    });

    axios.get(`${API_URL}/api/banners`).then((res) => {
      setBanners(res.data);
    });

    // 2. Socket Listeners
    socket.on("productAdded", (newProduct) => {
      setProducts((prevProducts) => {
        const isExist = prevProducts.find((item) => item._id === newProduct._id);
        return !isExist ? [newProduct, ...prevProducts] : prevProducts;
      });
    });

    socket.on("categoryAdded", (newCategory) => {
      setCategoryList((prev) => {
        const isExist = prev.find((cat) => cat._id === newCategory._id);
        return !isExist ? [...prev, newCategory] : prev;
      });
    });

    socket.on("bannerAdded", (newBanner) => {
      setBanners((prevBanners) => [...prevBanners, newBanner]);
    });

    // 3. Cleanup function
    return () => {
      socket.off("productAdded");
      socket.off("categoryAdded");
      socket.off("bannerAdded");
    };
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //  Filtering Logic
  const tabCategories = [
    "Fashion",
    "Electronics",
    "Bags",
    "Footwear",
    "Groceries",
    "Beauty",
    "Wellness",
    "Jewellery",
    "Others",
    "Foods",
  ];

  const popularProducts = products.filter(
    (item) =>
      item.category?.toLowerCase() === tabCategories[value].toLowerCase()
  );

  const featuredProducts = products.filter((item) => item.isFeatured === true);

  const latestProducts = [...products].reverse().slice(0, 8);

  const fashionProducts = products.filter(
    (item) => item.category === "Fashion"
  );

  const electronicProducts = products.filter(
    (item) => item.category === "Electronics"
  );

  const bagsProducts = products.filter((item) => item.category === "Bags");

  const footwearProducts = products.filter(
    (item) => item.category === "Footwear"
  );

  const groceriesProducts = products.filter(
    (item) => item.category === "Groceries"
  );

  const beautyProducts = products.filter((item) => item.category === "Beauty");

  const wellnessProducts = products.filter(
    (item) => item.category === "Wellness"
  );

  const jewelleryProducts = products.filter(
    (item) => item.category === "Jewellery"
  );

  //  Blog Section Image Chnage
  const blogData = [
    {
      id: 1,
      image:
        "https://serviceapi.spicezgold.com/download/1760239113701_NewProject(4).jpg",
      title: "Sustainable living through homes",
      date: "5 APRIL, 2026",
      description:
        "Give2 lady of they such they sure it. Perceived determine Continue indulged speaking the was out horrible for domestic position....",
    },
    {
      id: 2,
      image: "https://serviceapi.spicezgold.com/download/1741758993155_6-4.jpg",
      title:
        "Explore sustainable prefabricated homes",
      date: "10 MAY, 2026",
      description:
        "To perpetual do existence northward as difficult preserved daughters. Continued at up to zealously necessary breakfast...",
    },
    {
      id: 3,
      image:
        "https://i.pinimg.com/originals/48/3b/c4/483bc4298647036b69ff5cd04fce7fcc.jpg",
      title: "Best color combinations for living room",
      date: "12 JUNE, 2026",
      description:
        "Choosing the right colors can change the mood  See general few civilly amiable pleased account carried. Excellence projecting is devonshire...",
    },
    {
      id: 4,
      image:
        "https://i.pinimg.com/originals/56/f6/c2/56f6c29c6cb4aff1d53c617bb7536016.jpg",
      title: "Minimalist furniture ideas",
      date: "20 JULY, 2026",
      description:
        "Minimalism is not just a style, it is a way of life Drawings can followed improved out sociable not. Earnestly so do instantly pretended...",
    },
  ];

  return (
    <>
      <HomeSlider data={banners} />

      {/*-- Home Catagery Slider Function --*/}

      <HomeCategorySlider categories={categoryList} />

      <section className=" bg-[#ffff] py-8">
        <div className="container">
          <div className="flex item-center justify-between">
            <div className="leftSec">
              <h2 className="text-[22px] font-[600]">Popular Products</h2>
              <p className="text-[15px] font-[500]">
                Do not miss the Current Offers until the end of December.
              </p>
              <p></p>
            </div>

            <div className="rightSec w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {tabCategories.map((cat, index) => (
                  <Tab key={index} label={cat} />
                ))}
              </Tabs>
            </div>
          </div>

          {/*-- Product Catagery Tab Function (Popular Products) --*/}
          <div>
            <ProductsSlider items={6} products={popularProducts} />
          </div>
        </div>
      </section>

      {/*-- Home Slider V2 Function --*/}
      <section className="py-10 bg-[#ffff]">
        <div className="container flex gap-5">
          <div className="part1 w-[65%]">
            <HomeSliderV2 />
          </div>

          {/*-- BannerBox V2 Function --*/}
          <div className="part2 w-[27%] flex items-center justify-between gap-5 flex-col">
            <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_1.jpg"} />
            <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_2.jpg"} />
          </div>
        </div>
      </section>

      {/*-- AdsBanner Function --*/}
      <section className="py-5 pt-12 bg-[#ffff]">
        <div className="container">
          <div
            className="FreeShipping w-[85%] m-auto py-4 p-4 border-2 border-[#ff8a65] flex items-center
            justify-between rounded-md mb-7"
          >
            <div className="coll flex items-center gap-4">
              <FaShippingFast className="text-[60px]" />
              <span className="text-[26px] font-[600] uppercase">
                Free Shipping
              </span>
            </div>

            <div className="col2">
              <p className="mb-0 font-[500] text-[20px]">
                Free Delivery Now On Your First Order and Over $200
              </p>
            </div>

            <p className="font-bold text-[30px]">- Only $200*</p>
          </div>

          <AdsBannerSlider items={4} />
        </div>
      </section>

      {/*-- Latest Product & AdsBanner-(2) Tab Function --*/}
      <section className="bg-[#ffff] pt-0 py-5">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Latest Products</h2>

          <ProductsSlider items={6} products={latestProducts} />

          {/*-- BannerBox V2 Function --*/}
          <section className="py-12 bg-[#ffff]">
            <div className="part2 w-[full] flex items-center justify-between gap-5 ">
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_3.jpg"} />
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_4.webp"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_1.jpg"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_2.jpg"} />
            </div>
          </section>
        </div>
      </section>

      {/*-- Featured Product & AdsBanner-(2) Tab Function --*/}
      <section className="bg-[#ffff] pt-0 py-5 pb-8">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Featured Products</h2>

          <ProductsSlider items={6} products={featuredProducts} />

          <AdsBannerSlider items={3} />
        </div>
      </section>

      <section className="bg-[#ffff] pt-0 py-5 pb-8">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Fashion Products</h2>

          <ProductsSlider items={6} products={fashionProducts} />

          <h2 className="text-[22px] font-[600] mt-3">Electronics Products</h2>

          <ProductsSlider items={6} products={electronicProducts} />

          {/*-- BannerBox V2 Function --*/}
          <section className="py-12 bg-[#ffff]">
            <div className="part2 w-[full] flex items-center justify-between gap-5 ">
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_3.jpg"} />
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_4.webp"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_1.jpg"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_2.jpg"} />
            </div>
          </section>
        </div>
      </section>

      <section className="bg-[#ffff] pt-0 py-5 pb-8">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Bag Products</h2>

          <ProductsSlider items={6} products={bagsProducts} />

          <h2 className="text-[22px] font-[600] mt-3">Footwear Products</h2>

          <ProductsSlider items={6} products={footwearProducts} />

          <h2 className="text-[22px] font-[600] mt-3">Groceries Products</h2>

          <ProductsSlider items={6} products={groceriesProducts} />

          <AdsBannerSlider items={4} />

          <h2 className="text-[22px] font-[600] mt-3">Beauty Products</h2>

          <ProductsSlider items={6} products={beautyProducts} />

          <h2 className="text-[22px] font-[600] mt-3">Wellness Products</h2>

          <ProductsSlider items={6} products={wellnessProducts} />

          {/*-- BannerBox V2 Function --*/}
          <section className="py-12 bg-[#ffff]">
            <div className="part2 w-[full] flex items-center justify-between gap-5 ">
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_3.jpg"} />
              <BannerBoxV2 info="left" image={"BannerBoxV2_Banner_4.webp"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_1.jpg"} />
              <BannerBoxV2 info="right" image={"BannerBoxV2_Banner_2.jpg"} />
            </div>
          </section>

          <h2 className="text-[22px] font-[600] mt-3">Jewellery Products</h2>

          <ProductsSlider items={6} products={jewelleryProducts} />
        </div>
      </section>

      {/*-- Blog Section Tab Function --*/}
      <section className="blogSection bg-[#ffff] pt-0 py-5">
        <div className="container">
          <h2 className="text-[22px] font-[600] mb-4">From The Blog</h2>
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            navigation={true}
            modules={[Navigation]}
            className="blogSlider"
          >
            {blogData.length !== 0 &&
              blogData.map((item, index) => {
                return (
                  <SwiperSlide key={item.id}>
                    <BlogItem
                      title={item.title}
                      image={item.image}
                      date={item.date}
                      description={item.description}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Home;
