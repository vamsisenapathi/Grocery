# Cart and Address Page Fixes

## Issues Fixed

### 1. Missing Navigation Bar on Address Page ✅
**Problem:** The Saved Addresses page was missing the top navigation bar (AppNavbar) with search, home, and cart buttons.

**Solution:** 
- Added `AppNavbar` import to `SavedAddressesPage.js`
- Wrapped the page content in a React fragment (`<>...</>`) 
- Added `AppNavbar` component at the top of the page
- Added top margin (`mt: 2`) to the container for proper spacing

**Files Modified:**
- `src/pages/SavedAddressesPage.js`

### 2. Cart Items Not Adding/Removing (+ - buttons not working) ✅
**Problem:** 
- Backend validation was rejecting requests with `quantity < 1`
- Frontend was sending negative quantities (e.g., `-1`) for decrement operations
- PUT endpoint was missing from mock server
- Error: "Quantity must be at least 1" validation error

**Solution:**

#### Frontend Changes:
1. **api.service.js** - Fixed cart operations to use absolute quantities:
   - Added `updateItem(cartItemId, quantity)` method using PUT endpoint
   - Refactored `incrementItem()` to:
     - Fetch current cart
     - Find existing item
     - Send absolute quantity via PUT if item exists
     - Send POST to add new item if doesn't exist
   - Refactored `decrementItem()` to:
     - Fetch current cart
     - Find existing item
     - Send absolute quantity via PUT if quantity > 0
     - Send DELETE if quantity would be 0

2. **CartDrawer.js** - Updated handlers to use absolute quantities:
   - `handleIncrement()` now calls `updateItem(cartItemId, currentQuantity + 1)`
   - `handleDecrement()` now calls `updateItem(cartItemId, currentQuantity - 1)` or `removeItem()` if quantity is 1
   - Both handlers pass `cartItemId` and `currentQuantity` to the API

#### Backend Changes:
3. **mock-server.js** - Added PUT endpoint for cart updates:
   - Added `PUT /api/v1/cart/items/:cartItemId` endpoint
   - Validates quantity >= 1
   - Updates cart item with absolute quantity
   - Recalculates cart totals
   - Returns updated cart data

**Files Modified:**
- `src/services/api.service.js`
- `src/components/grocery/CartDrawer.js`
- `mock-server.js`

## How It Works Now

### Cart Operations Flow:

1. **Adding Items (First Time)**
   - User clicks "ADD" on product card
   - `addItem()` → POST `/cart/items` with `quantity: 1`
   - Item added to cart

2. **Incrementing Items**
   - User clicks "+" button
   - `incrementItem()` → Fetches cart → Finds item → PUT `/cart/items/:id` with `quantity: currentQty + 1`
   - Cart updated with new quantity

3. **Decrementing Items**
   - User clicks "-" button
   - If quantity > 1: `decrementItem()` → PUT `/cart/items/:id` with `quantity: currentQty - 1`
   - If quantity = 1: `removeItem()` → DELETE `/cart/items/:id`
   - Cart updated or item removed

4. **From Cart Drawer**
   - Uses `updateItem()` directly with absolute quantities
   - Always sends valid quantity >= 1 or deletes the item

## Testing

To test the fixes:

1. **Start Mock Server:**
   ```powershell
   node .\mock-server.js
   ```

2. **Start Frontend:**
   ```powershell
   npm start
   ```

3. **Test Address Page:**
   - Navigate to http://localhost:3000/addresses
   - ✅ Top navigation bar should be visible
   - ✅ Search, home, cart icons should be present

4. **Test Cart Operations:**
   - Add items from product list
   - Click "+" to increment → Should work without errors
   - Click "-" to decrement → Should work without errors
   - When quantity reaches 0, item should be removed
   - Open cart drawer and test +/- buttons → Should work smoothly

## API Endpoints

The mock server now supports all cart operations:

- `GET /api/v1/cart/:userId` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:cartItemId` - Update item quantity (NEW)
- `DELETE /api/v1/cart/items/:cartItemId` - Remove item from cart

## Notes

- All cart operations now use absolute quantities (never negative)
- Backend validation ensures quantity >= 1 for PUT operations
- Decrement from quantity 1 triggers DELETE instead of PUT
- Cart drawer handlers include fallback logic for edge cases
- ProductCard increment/decrement also uses the new logic
