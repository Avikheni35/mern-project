import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCartData = createAsyncThunk('cartdata/fetch', async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/user/cart', {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
});

export const addCartData = createAsyncThunk('cartdata/add', async (product) => {
    const token = localStorage.getItem('token')
    const response = await axios.post('http://localhost:8000/user/cart', {product},
        {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: { cartProducts: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartData.rejected, (state, action) => {
                console.log("error");
                state.status = 'loading';
            })
            .addCase(fetchCartData.fulfilled, (state, action) => {
                state.cartProducts = action.payload;
                state.status = 'success';
            })

            .addCase(addCartData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCartData.fulfilled, (state, action) => {
                state.cartProducts = action.payload;
                state.status = 'success';
                state.error = null; // Clear any previous errors
            })
            .addCase(addCartData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message; // Store error message
            });
    },
});

export default cartSlice.reducer;