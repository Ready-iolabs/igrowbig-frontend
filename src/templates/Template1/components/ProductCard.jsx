import React from 'react';
import { Link } from 'react-router-dom';
// import { Card, CardContent } from '../components/ui/card';
// import { Button } from '../components/ui/button';
import { Card , CardContent } from '@/components/ui/card';

function ProductCard({ product }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg font-semibold">{product.name}</p>
        <Button asChild variant="outline" className="mt-2">
          <Link to={`/product/${product.id}`}>Learn More & Buy</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;