// Initial state
export const initialState = {
  items: [],
};

// Cart reducer function
export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { id, name, price, image } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { id, name, price, image, quantity: 1 }],
      };
    }

    case "INCREASE_QTY": {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    }

    case "DECREASE_QTY": {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "REMOVE_ITEM": {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
}