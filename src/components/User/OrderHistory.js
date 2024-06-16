import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        };
        fetchOrders();
    }, []);

    return (
        <div>
            {orders.map(order => (
                <div key={order.id}>
                    <h3>Order ID: {order.id}</h3>
                    <p>Plan: {order.plan.name}</p>
                    <p>Date: {order.date}</p>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;
