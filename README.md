# E-Commerce Leegality

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Assumptions Made

- Product data comes from the public DummyJSON API.
- Category filters and brand filters are based on the API response, not on a local database.
- The app is intended as a client-side React storefront demo rather than a full checkout system.
- Cart, profile, and account buttons are present for UI completeness, but they do not yet perform actions.
- The product detail page is expected to load by route parameter using `/product/:id`.

## Architectural Decisions

- Vite was used for a fast React development workflow and simple production builds.
- React Router is used for page-level navigation between the listing page and product detail page.
- The app keeps filter state in the top-level `App` component so the sidebar, search, pagination, and grid stay in sync.
- Listing state is persisted in `localStorage` so refreshes preserve the current filters, page, and sidebar state.
- API access is centralized in `src/api/products.js` to keep fetch logic in one place.
- Presentational pieces such as the product card, grid, pagination, and sidebar are split into reusable components.

## Improvements If Given More Time

- Add loading skeletons for the grid and detail view.
- Add better error recovery, including retry actions for API failures.
- Add sorting options such as price, rating, and newest.
- Replace hard-coded UI actions like cart/profile with real interactions.
- Add tests for filtering, pagination, and routing behavior.
- Improve accessibility with more keyboard and screen reader checks.
- Reduce CSS size further by consolidating repeated layout patterns.
