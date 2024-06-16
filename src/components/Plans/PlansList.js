import React, { useState, useEffect } from 'react';

function PlansList({ addToCart }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Fetch plans from backend or mock data
    const fetchPlans = async () => {
      // Example: Replace with actual fetch logic
      const data = [
        { id: 1, name: 'Basic Plan', price: 0 },
        { id: 2, name: 'Standard Plan', price: 4999 },
        { id: 3, name: 'Plus Plan', price: 3999 }
      ];
      setPlans(data);
    };

    fetchPlans();
  }, []);

  const handleAddToCart = (plan) => {
    addToCart(plan);
  };

  return (
    <div>
      <h2>Available Plans</h2>
      <ul>
        {plans.map(plan => (
          <li key={plan.id}>
            <h3>{plan.name}</h3>
            <p>Price: {plan.price}</p>
            <button onClick={() => handleAddToCart(plan)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlansList;





