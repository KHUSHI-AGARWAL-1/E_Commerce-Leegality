import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return <div className="state-message">No products match the selected filters.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
