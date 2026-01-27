import React, { useContext, useEffect, useState } from "react";
import MyListItems from "./myListItems";
import AccountSlidebar from "../../components/AccountSlidebar";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

/*-- Mylist Page Function --*/
const MyList = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [myList, setMyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyList();
  }, []);

  const fetchMyList = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/myList").then((res) => {
      setMyList(res.data);
      setIsLoading(false);
    });
  };

  const removeItem = (id) => {
    deleteData(`/api/myList/${id}`).then((res) => {
      if (res.status !== false) {
        context.openAlertBox("success", "Item removed!");
        fetchMyList();
        context.setMyListCount(context.myListCount - 1);
      }
    });
  };

  return (
    <section className="py-10 w-full bg-[#f1f1f1] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Circle */}
        <div
          className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] 
          bg-[#ffccbcb4] rounded-full opacity-50"
        ></div>
        {/* Bottom Left Circle */}
        <div
          className="absolute -bottom-[100px] -left-[100px] w-[450px] h-[450px] 
          bg-[#ffccbcad] rounded-full opacity-50"
        ></div>
      </div>

      <div className="container mx-auto w-[80%] flex gap-5 relative z-10">
        {/* --- LEFT SIDEBAR (PROFILE NAVIGATION) --- */}
        <div className="col1 w-[20%]">
          <AccountSlidebar />
        </div>

        {/* --- RIGHT SIDE (CONTENT AREA) --- */}
        <div className=" col2 w-[65%]">
          <div className="shadow-md rounded-md bg-[#fff]">
            <div className="py-4 px-4 border-b !border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] uppercase font-[700]">My List</h2>
              <p className="mt-0 text-[15px] font-[500]">
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {myList?.length}{" "}
                </span>{" "}
                products in your My List
              </p>
            </div>

            {isLoading ? (
              <div className="p-5 text-center">Loading...</div>
            ) : myList?.length > 0 ? (
              myList.map((item, index) => (
                <MyListItems key={index} item={item} removeItem={removeItem} />
              ))
            ) : (
              <div className="p-5 text-center">Your list is empty.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
