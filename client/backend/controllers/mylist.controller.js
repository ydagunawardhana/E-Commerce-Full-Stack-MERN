import MyListModel from "../models/mylist.model.js";

// Product Add to My List
export const addToMyListController = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
    } = request.body;

    const item = await MyListModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (item) {
      return response.status(400).json({
        message: "Item already in Mylist",
      });
    }

    const myList = new MyListModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
      userId,
    });

    const save = await myList.save();

    return response.status(200).json({
      message: "Item added to My List",
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

// Delete Item in My List
export const deleteToMyListController = async (request, response) => {
  try {
    const myListItem = await MyListModel.findById(request.params.id);

    if (!myListItem) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "The Item with this Given id not found!",
      });
    }

    const deletedItem = await MyListModel.findByIdAndDelete(request.params.id);

    if (!deletedItem) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "The item is not deleted!",
      });
    }

    return response.status(200).json({
      message: "Item removed from My List successfully",
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

// get Item in My List
export const getMyListController = async (request, response) => {
  try {
    const userId = request.userId;

    const myListItems = await MyListModel.find({
      userId: userId,
    });

    return response.status(200).json({
      message: "My list items fetched successfully",
      error: false,
      success: true,
      data: myListItems,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
