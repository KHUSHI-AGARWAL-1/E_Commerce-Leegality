import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const roundedRating = Math.round(product.rating);
  const stars = Array.from({ length: 5 }, (_, index) => (index < roundedRating ? '★' : '☆')).join('');

  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <div className="product-image-wrap">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <div className="product-meta">
          <strong>${product.price}</strong>
          <span className="rating">
            <span className="stars" aria-label={`${product.rating} out of 5 stars`}>
              {stars}
            </span>
            <span>({product.rating})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
