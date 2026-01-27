import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

// Add Address Controller
export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId; // Auth middleware
    const { address_line, city, state, pincode, country, mobile, status } =
      request.body;

    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return response.status(400).json({
        message: "Please provide all required fields",
        error: true,
        success: false,
      });
    }

    // 1. Address create
    const createAddress = new AddressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId: userId,
    });

    const saveAddress = await createAddress.save();

    // 2. User Model (address_details array )
    await UserModel.updateOne(
      { _id: userId },
      { $push: { address_details: saveAddress._id } }
    );

    return response.json({
      message: "Address created successfully",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get Address Controller
export const getAddressController = async (request, response) => {
  try {
    const userId = request.userId;

    const data = await AddressModel.find({ userId: userId }).sort({
      createdAt: -1,
    });

    return response.json({
      data: data,
      message: "User addresses",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Delete Address Controller
export const deleteAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id } = request.params;

    // Address Delete
    const deleteAddress = await AddressModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deleteAddress) {
      return response.status(404).json({
        message: "Address not found or you are not authorized",
        error: true,
        success: false,
      });
    }

    // User Model address_details
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { address_details: id } }
    );

    return response.json({
      message: "Address deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
