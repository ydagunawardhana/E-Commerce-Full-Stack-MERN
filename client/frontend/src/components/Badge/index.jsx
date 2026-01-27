import React from "react";

const Badge = ({ status }) => {
  const finalStatus = status || "Pending";
  let styles = "";

  switch (finalStatus.toLowerCase()) {
    case "pending":
      styles = "bg-[#ff5252] text-white";
      break;

    case "confirmed":
      styles = "bg-[#2e7d32] text-white";
      break;

    case "processing":
      styles = "bg-[#f0ad4e]  text-white";
      break;

    case "shipped":
      styles = "bg-[#ffcc00]  text-white";
      break;

    case "delivered":
      styles = "bg-[#363636]  text-white";
      break;

    case "cancelled":
      styles = "bg-[#f44336]  text-white";
      break;

    default:
      styles = "bg-[#ff5252]  text-white";
  }

  return (
    <span
      className={`px-4 py-1 rounded-full text-[12px] font-[600] uppercase 
      tracking-wide ${styles}`}
    >
      {finalStatus}
    </span>
  );
};

export default Badge;
