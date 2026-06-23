import { useEffect, useMemo, useState } from 'react';
import { getCategories, getProducts, getProductsByCategory } from './api/products.js';
import FilterSidebar from './components/FilterSidebar.jsx';
import { CartIcon, SearchIcon } from './components/Icons.jsx';
import Pagination from './components/Pagination.jsx';
import ProductGrid from './components/ProductGrid.jsx';

const PAGE_SIZE = 8;

const initialFilters = {
  categories: [],
  minPrice: '',
  maxPrice: '',
  brands: [],
  search: '',
  sidebarSearch: '',
};

const STORAGE_KEY = 'productListingState';

function getStoredListingState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return {
      filters: {
        ...initialFilters,
        ...(savedState?.filters || {}),
        categories: Array.isArray(savedState?.filters?.categories)
          ? savedState.filters.categories
          : [],
        brands: Array.isArray(savedState?.filters?.brands) ? savedState.filters.brands : [],
      },
      page: Number(savedState?.page) || 1,
      isFilterOpen:
        typeof savedState?.isFilterOpen === 'boolean' ? savedState.isFilterOpen : true,
    };
  } catch {
    return {
      filters: initialFilters,
      page: 1,
      isFilterOpen: true,
    };
  }
}

function normalizeCategory(category) {
  if (typeof category === 'string') {
    return {
      slug: category,
      name: category
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    };
  }

  return {
    slug: category.slug,
    name: category.name,
  };
}

function filterProducts(products, filters) {
  const min = filters.minPrice === '' ? null : Number(filters.minPrice);
  const max = filters.maxPrice === '' ? null : Number(filters.maxPrice);

  return products.filter((product) => {
    const searchText = filters.search.trim().toLowerCase();
    const sidebarSearchText = filters.sidebarSearch.trim().toLowerCase();
    const searchableText = [product.title, product.brand, product.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesMin = min === null || product.price >= min;
    const matchesMax = max === null || product.price <= max;
    const matchesSearch = searchText === '' || searchableText.includes(searchText);
    const matchesSidebarSearch =
      sidebarSearchText === '' || searchableText.includes(sidebarSearchText);
    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(product.category);
    const matchesBrand =
      filters.brands.length === 0 || filters.brands.includes(product.brand || 'Unbranded');

    return matchesSearch && matchesSidebarSearch && matchesCategory && matchesMin && matchesMax && matchesBrand;
  });
}

export default function App() {
  const storedListingState = useMemo(getStoredListingState, []);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState(storedListingState.filters);
  const [isFilterOpen, setIsFilterOpen] = useState(storedListingState.isFilterOpen);
  const [page, setPage] = useState(storedListingState.page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        filters,
        page,
        isFilterOpen,
      }),
    );
  }, [filters, page, isFilterOpen]);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!ignore) {
          setCategories(data.map(normalizeCategory));
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load product categories.');
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError('');

      try {
        let data;

        if (filters.categories.length === 0) {
          data = await getProducts({ limit: 100, skip: 0 });
        } else if (filters.categories.length === 1) {
          data = await getProductsByCategory(filters.categories[0]);
        } else {
          const categoryResponses = await Promise.all(
            filters.categories.map((category) => getProductsByCategory(category)),
          );
          data = {
            products: categoryResponses.flatMap((response) => response.products || []),
          };
        }

        if (!ignore) {
          setAllProducts(data.products || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load products.');
          setAllProducts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [filters.categories]);

  const brands = useMemo(() => {
    return Array.from(new Set(allProducts.map((product) => product.brand || 'Unbranded'))).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  function updateFilters(nextFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleFilterChange(name, value) {
    updateFilters({
      ...filters,
      [name]: value,
      ...(name === 'categories' ? { brands: [] } : {}),
    });
  }

  function handleCategoryToggle(categorySlug) {
    const nextCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((category) => category !== categorySlug)
      : [...filters.categories, categorySlug];

    handleFilterChange('categories', nextCategories);
  }

  function handleBrandToggle(brand) {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];

    updateFilters({
      ...filters,
      brands: nextBrands,
    });
  }

  function handlePriceApply(priceFilters) {
    updateFilters({
      ...filters,
      ...priceFilters,
    });
  }

  function clearFilters() {
    updateFilters(initialFilters);
  }

  return (
    <main className="store-frame">
      <header className="store-topbar">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
          aria-expanded={isFilterOpen}
          onClick={() => setIsFilterOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <label className="top-search">
          <SearchIcon className="search-icon" />
          <input
            type="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(event) => handleFilterChange('search', event.target.value)}
          />
        </label>

        <div className="top-actions" aria-label="Account actions">
          <button className="nav-icon cart-icon" type="button" aria-label="Cart">
            <CartIcon className="cart-icon" />
          </button>
          <button className="nav-icon circle-user-icon" type="button" aria-label="Profile">
            <span />
          </button>
          <button className="nav-icon person-icon" type="button" aria-label="Account">
            <span />
          </button>
        </div>
      </header>

      <div className={`catalog-layout ${isFilterOpen ? '' : 'filters-closed'}`}>
        {isFilterOpen && (
          <FilterSidebar
            brands={brands}
            categories={categories}
            filters={filters}
            onBrandToggle={handleBrandToggle}
            onCategoryToggle={handleCategoryToggle}
            onPriceApply={handlePriceApply}
            onChange={handleFilterChange}
            onClear={clearFilters}
          />
        )}

        <section className="products-panel" aria-live="polite">
          <div className="products-title-row">
            {isFilterOpen ? (
              <h1>
                <SearchIcon className="section-search-icon" />
                Filters
              </h1>
            ) : (
              <span />
            )}
            <span>{filteredProducts.length} items</span>
          </div>
          {error && <div className="state-message error">{error}</div>}
          {loading && <div className="state-message">Loading products...</div>}
          {!loading && !error && (
            <>
              <ProductGrid products={paginatedProducts} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
