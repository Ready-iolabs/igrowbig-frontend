import React from 'react';
import { Link } from 'react-router-dom';
// import { Card, CardContent } from '../components/ui/card';
import { Card,CardContent } from '@/components/ui/card';

function CategoryCard({ category }) {
  return (
    <Link to="/products">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col items-center p-4">
          <img src={category.image} alt={category.name} className="w-12 h-12 mb-2" />
          <p className="text-sm font-semibold text-center">{category.name.toUpperCase()}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCard;