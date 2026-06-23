import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../api/products.js';
import { CartIcon, SearchIcon } from '../components/Icons.jsx';

function renderStars(rating = 0) {
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
  return '★★★★★'.slice(0, fullStars) + '☆☆☆☆☆'.slice(0, 5 - fullStars);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError('');

      try {
        const data = await getProductById(id);
        if (!ignore) {
          setProduct(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load product details.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <main className="store-frame detail-frame">
      <header className="store-topbar">
        <button className="icon-button menu-button" type="button" aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>

        <label className="top-search detail-search-field">
          <SearchIcon className="search-icon" />
          <input type="search" placeholder="Search products..." readOnly />
        </label>

        <div className="top-actions" aria-label="Account actions">
          <button className="nav-icon cart-icon" type="button" aria-label="Cart">
            <CartIcon />
          </button>
          <button className="nav-icon circle-user-icon" type="button" aria-label="Profile">
            <span />
          </button>
          <button className="nav-icon person-icon" type="button" aria-label="Account">
            <span />
          </button>
        </div>
      </header>

      <section className="detail-page">
        <div className="detail-page-inner">
          {loading && <div className="state-message">Loading product details...</div>}
          {error && <div className="state-message error">{error}</div>}

          {!loading && !error && product && (
            <article className="detail-layout detail-mockup">
              <div className="detail-card-head">
                <button className="back-button detail-back-button" type="button" onClick={() => navigate(-1)}>
                  {'←'} Back
                </button>
              </div>

              <div className="detail-image">
                <img src={product.thumbnail} alt={product.title} />
              </div>

              <div className="detail-content detail-panel">
                <h1>{product.title}</h1>
                <div className="detail-price-row">
                  <div className="detail-price">${product.price}</div>
                  <div className="detail-rating">
                    <span className="stars" aria-hidden="true">
                      {renderStars(product.rating)}
                    </span>
                    <span>({product.rating})</span>
                  </div>
                </div>

                <div className="detail-meta-lines">
                  <p>
                    <strong>Brand:</strong> {product.brand || 'Unbranded'}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                </div>

                <div className="detail-divider" />

                <section className="detail-section">
                  <h2>Description</h2>
                  <p className="description">{product.description}</p>
                </section>

                <div className="detail-divider" />

                <section className="detail-section">
                  <h2>Reviews</h2>
                  <div className="reviews-list">
                    {(product.reviews?.length ? product.reviews : []).slice(0, 2).map((review, index) => (
                      <article className="review-item" key={`${review.reviewerName || 'review'}-${index}`}>
                        <div className="review-head">
                          <strong>{review.reviewerName || 'Reviewer'}</strong>
                          <span className="review-stars" aria-hidden="true">
                            {renderStars(review.rating)}
                          </span>
                          <span>({review.rating ?? 4.0})</span>
                        </div>
                        <p>{review.comment || 'Great product.'}</p>
                      </article>
                    ))}

                    {(!product.reviews || product.reviews.length === 0) && (
                      <article className="review-item">
                        <div className="review-head">
                          <strong>Emily</strong>
                          <span className="review-stars" aria-hidden="true">
                            {renderStars(4)}
                          </span>
                          <span>(4.0)</span>
                        </div>
                        <p>Excellent phone with great camera and battery life.</p>
                      </article>
                    )}
                  </div>
                </section>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
