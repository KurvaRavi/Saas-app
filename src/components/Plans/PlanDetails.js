import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlanDetail = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            const response = await axios.get(`/api/plans/${id}`);
            setPlan(response.data);
        };
        fetchPlan();
    }, [id]);

    if (!plan) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <p>{plan.price}</p>
        </div>
    );
};

export default PlanDetail;
