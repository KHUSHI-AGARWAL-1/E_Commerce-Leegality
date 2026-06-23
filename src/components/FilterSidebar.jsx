import { useEffect, useState } from 'react';

export default function FilterSidebar({
  brands,
  categories,
  filters,
  onBrandToggle,
  onCategoryToggle,
  onChange,
  onClear,
  onPriceApply,
}) {
  const visibleCategories = categories.slice(0, 7);
  const visibleBrands = brands.slice(0, 8);
  const [priceDraft, setPriceDraft] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  useEffect(() => {
    setPriceDraft({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [filters.minPrice, filters.maxPrice]);

  function handlePriceDraftChange(name, value) {
    setPriceDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  }

  return (
    <aside className="filters" aria-label="Product filters">
      <label className="sidebar-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search..."
          value={filters.sidebarSearch}
          onChange={(event) => onChange('sidebarSearch', event.target.value)}
        />
      </label>

      <div className="filter-group">
        <div className="filter-title-row">
          <span className="group-label">Categories</span>
          {(filters.categories.length > 0 || filters.brands.length > 0 || filters.minPrice || filters.maxPrice) && (
            <button className="text-button" type="button" onClick={onClear}>
              Clear
            </button>
          )}
        </div>

        <div className="checkbox-list">
          {visibleCategories.map((category) => (
            <label className="checkbox-row" key={category.slug}>
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => onCategoryToggle(category.slug)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group price-group">
        <span className="group-label">Price Range</span>
        <div className="price-row">
          <label className="field compact">
            <input
              min="0"
              type="number"
              value={priceDraft.minPrice}
              onChange={(event) => handlePriceDraftChange('minPrice', event.target.value)}
              placeholder="Min"
            />
          </label>
          <label className="field compact">
            <input
              min="0"
              type="number"
              value={priceDraft.maxPrice}
              onChange={(event) => handlePriceDraftChange('maxPrice', event.target.value)}
              placeholder="Max"
            />
          </label>
        </div>
        <button className="apply-button" type="button" onClick={() => onPriceApply(priceDraft)}>
          Apply
        </button>
      </div>

      <div className="filter-group">
        <span className="group-label">Brand</span>
        <div className="checkbox-list">
          {visibleBrands.length === 0 && <p className="muted">No brands available</p>}
          {visibleBrands.map((brand) => (
            <label className="checkbox-row" key={brand}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
