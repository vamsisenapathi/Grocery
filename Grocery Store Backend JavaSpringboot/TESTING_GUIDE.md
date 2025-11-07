# Complete Testing Guide
## Frontend + Backend Integration Testing

**Last Updated:** December 2024  
**Status:** Ready for Testing ✅

---

## 🎯 Overview

This guide will help you test the complete Grocery Store application (React frontend + Spring Boot backend) to verify all features are working correctly.

---

## 📋 Pre-Testing Checklist

### ✅ Backend Status
- [x] All 801 products loaded with valid Unsplash images
- [x] Cart API endpoints validated and working
- [x] Search API working for all keywords
- [x] PostgreSQL database running on localhost:5432
- [x] Backend API running on localhost:8081

### ✅ Frontend Status
- [x] Cart API integration verified correct
- [x] Redux state management properly configured
- [x] Quantity validation implemented
- [x] Error handling comprehensive
- [x] Image fallback logic in place

---

## 🚀 Step 1: Start Backend

### Option A: Using Maven Wrapper (Recommended)
```powershell
cd "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
.\mvnw clean spring-boot:run
```

### Option B: Using Batch File
```powershell
cd "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
.\start.bat
```

### Option C: Using PowerShell Script
```powershell
cd "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
.\start.ps1
```

### ✅ Verify Backend is Running

**Expected Console Output:**
```
Started GroceryAppBackendApplication in X.XXX seconds
```

**Test Backend Health:**
```powershell
# In a new PowerShell window
curl http://localhost:8081/api/v1/products | ConvertFrom-Json | Select-Object -First 5
```

**Expected:** JSON array with product data

---

## 🌐 Step 2: Start Frontend

### Open New Terminal Window
```powershell
cd "C:\Vamsi\React js\App\Grocery Store\Grocery Store Frontend React JS"
npm start
```

### ✅ Verify Frontend is Running

**Expected:**
- Browser opens automatically to `http://localhost:3000`
- React app loads without console errors
- Products grid appears

**Check Browser Console (F12):**
- No red errors
- API requests logging: `🚀 API Request: GET /products`
- API responses logging: `✅ API Response: /products`

---

## 🧪 Step 3: Functional Testing

### Test 1: Product Listing ✅

**Action:**
1. Open app at `http://localhost:3000`
2. Scroll through products

**Expected Results:**
- ✅ All products display with images
- ✅ Images are from Unsplash (category-appropriate)
- ✅ No broken image icons (placeholder shown if load fails)
- ✅ Product names, prices, stock info visible
- ✅ "Add to Cart" button visible on each card

**Console Check:**
```
🚀 API Request: GET /products
✅ API Response: /products
```

**Screenshots to Verify:**
- Products grid layout
- Product images loading
- No console errors

---

### Test 2: Search Functionality 🔍

**Action 1: Search for "milk"**
```
1. Click search bar
2. Type: milk
3. Press Enter
```

**Expected Results:**
- ✅ Shows milk products (Whole Milk, Almond Milk, etc.)
- ✅ Products have milk-related images
- ✅ No unrelated products shown

**Action 2: Search for "apple"**
```
1. Clear search
2. Type: apple
3. Press Enter
```

**Expected Results:**
- ✅ Shows apple products (Fresh Apples, Apple Juice, etc.)
- ✅ Products have apple images
- ✅ Search is case-insensitive

**Action 3: Search for "chips"**
```
1. Clear search
2. Type: chips
3. Press Enter
```

**Expected Results:**
- ✅ Shows chips products (Potato Chips, Tortilla Chips, etc.)
- ✅ Products have chips images

**Console Check:**
```
🚀 API Request: GET /products/search?query=milk
✅ API Response: /products/search?query=milk
```

**Test More Keywords:**
- bread ✅
- cheese ✅
- chicken ✅
- orange ✅
- rice ✅

---

### Test 3: Add to Cart (Not Logged In) 🛒

**Action:**
1. Click "Add to Cart" on any product
2. Observe behavior

**Expected Results:**
- ⚠️ Shows warning: "Please login to add items to cart"
- 🔀 Redirects to login page
- ✅ No errors in console

---

### Test 4: User Authentication 🔐

**Action 1: Login**
```
1. Navigate to login page
2. Enter credentials
3. Submit form
```

**Expected Results:**
- ✅ Token stored in localStorage
- ✅ Redirects to home page
- ✅ User state updated in Redux

**Console Check:**
```
✅ User logged in successfully
Token stored in localStorage
```

**Action 2: Verify Auth State**
```
F12 → Console → Type:
localStorage.getItem('token')
```

**Expected:** JWT token string

---

### Test 5: Add Product to Cart ✅

**Action:**
1. While logged in, click "Add to Cart" on a product
2. Wait for confirmation

**Expected Results:**
- ✅ Success message: "{Product Name} added to cart!"
- ✅ Cart icon updates with item count
- ✅ No duplicate items (quantity increases if already in cart)

**Console Check:**
```
🚀 API Request: POST /cart/items
Request Data: { userId: "...", productId: "...", quantity: 1 }
✅ API Response: /cart/items
✅ Cart fetched successfully
```

**Verify Cart:**
1. Click cart icon
2. See added product with quantity 1

---

### Test 6: Increment Cart Item Quantity ➕

**Action:**
1. Open cart drawer/page
2. Find item with quantity 1
3. Click [+] button

**Expected Results:**
- ✅ Quantity changes from 1 → 2
- ✅ Item total price updates (price × 2)
- ✅ Cart total updates
- ✅ No duplicate items created

**Console Check:**
```
🚀 API Request: PUT /cart/items/{itemId}
Request Data: { quantity: 2 }
✅ API Response: /cart/items/{itemId}
🔄 Updating cart item: { cartItemId: "...", quantity: 2 }
✅ Item updated successfully
```

**Verify:**
- Quantity display shows: 2
- Subtotal = price × 2
- No errors in console

**Test Multiple Increments:**
1. Click [+] again → Quantity becomes 3
2. Click [+] again → Quantity becomes 4
3. Verify each update works correctly

---

### Test 7: Decrement Cart Item Quantity ➖

**Action:**
1. Find item with quantity > 1
2. Click [-] button

**Expected Results:**
- ✅ Quantity decreases by 1
- ✅ Item total price updates
- ✅ Cart total updates

**Console Check:**
```
🚀 API Request: PUT /cart/items/{itemId}
Request Data: { quantity: 1 }
✅ API Response: /cart/items/{itemId}
🔄 Updating cart item: { cartItemId: "...", quantity: 1 }
✅ Item updated successfully
```

**Verify:**
- Quantity decremented correctly
- No errors in console

---

### Test 8: Decrement at Minimum Quantity 🔒

**Action:**
1. Find item with quantity = 1
2. Observe [-] button state
3. Try clicking [-] button

**Expected Results:**
- ✅ [-] button is DISABLED (grayed out)
- ✅ Clicking does nothing
- ✅ Quantity stays at 1
- ✅ No API call made
- ✅ No errors in console

**Verify:**
```
Inspect element → Button should have:
disabled={true}
```

---

### Test 9: Manual Quantity Input ⌨️

**Action 1: Valid Input**
```
1. Find quantity TextField
2. Click to focus
3. Clear and type: 5
4. Press Enter or click away
```

**Expected Results:**
- ✅ Quantity updates to 5
- ✅ API call: `PUT /cart/items/{itemId}` with quantity: 5
- ✅ Item total updates
- ✅ Cart refreshes

**Action 2: Invalid Input (Zero)**
```
1. Click quantity TextField
2. Clear and type: 0
3. Press Enter
```

**Expected Results:**
- ✅ Blocked by validation (stays at previous value)
- OR
- ✅ Defaults to 1 automatically
- ✅ No API call with quantity: 0

**Action 3: Invalid Input (Negative)**
```
1. Click quantity TextField
2. Try typing: -5
```

**Expected Results:**
- ✅ HTML5 validation prevents negative (due to `min: 1`)
- OR
- ✅ Defaults to 1 if entered
- ✅ No API call with negative quantity

**Action 4: Invalid Input (Text)**
```
1. Click quantity TextField
2. Type: abc
```

**Expected Results:**
- ✅ `parseInt()` returns NaN
- ✅ Defaults to 1 (due to `|| 1`)
- ✅ Shows quantity 1 in field

---

### Test 10: Remove Item from Cart 🗑️

**Action:**
1. Find any item in cart
2. Click "Remove" button

**Expected Results:**
- ✅ Item disappears from cart
- ✅ Cart total updates
- ✅ If last item: Cart shows empty state

**Console Check:**
```
🚀 API Request: DELETE /cart/items/{itemId}
✅ API Response: /cart/items/{itemId}
🗑️ Removing item from cart: { cartItemId: "..." }
✅ Item removed successfully from backend
```

**Verify:**
- Item no longer in cart
- No errors in console
- Cart updates correctly

---

### Test 11: Add Same Product Multiple Times 🔄

**Action:**
1. Add Product A to cart
2. Go back to products
3. Click "Add to Cart" on Product A again

**Expected Results:**
- ✅ Quantity increases (NOT duplicate item)
- ✅ Cart shows 1 item with quantity 2
- ✅ Not 2 items with quantity 1 each

**Console Check:**
```
First Add:
POST /cart/items { productId: "A", quantity: 1 }

Second Add:
POST /cart/items { productId: "A", quantity: 1 }
Backend should handle increment internally
```

**Verify Cart State:**
- Only ONE CartItem for Product A
- Quantity = 2

---

### Test 12: Category Filtering 📂

**Action:**
1. Click category filter (if available)
2. Select "Dairy"

**Expected Results:**
- ✅ Shows only dairy products
- ✅ Milk, cheese, yogurt, butter visible
- ✅ No fruits or vegetables shown

**Test All Categories:**
- Fruits ✅
- Vegetables ✅
- Bakery ✅
- Meat ✅
- Snacks ✅
- Beverages ✅

**Console Check:**
```
🚀 API Request: GET /products?category=Dairy
✅ API Response: /products?category=Dairy
```

---

### Test 13: Featured Products ⭐

**Action:**
1. Navigate to "Featured Products" section
2. Observe products shown

**Expected Results:**
- ✅ Shows products with `featured: true`
- ✅ Approximately 261 featured products (as per backend)
- ✅ Images load correctly

**Console Check:**
```
🚀 API Request: GET /products/featured
✅ API Response: /products/featured
```

---

### Test 14: Image Loading Edge Cases 🖼️

**Test Scenario 1: Valid Unsplash URL**
```
Product with imageUrl: "https://images.unsplash.com/photo-..."
```

**Expected:**
- ✅ Image loads and displays
- ✅ No placeholder shown

**Test Scenario 2: Invalid URL (Simulated)**
```
1. Open DevTools → Network tab
2. Block images.unsplash.com
3. Reload page
```

**Expected:**
- ✅ `onError` handler fires
- ✅ Fallback placeholder shown
- ✅ Placeholder has product name text
- ✅ No broken image icon

**Test Scenario 3: Slow Network**
```
1. DevTools → Network tab → Throttling → Slow 3G
2. Reload page
```

**Expected:**
- ✅ Images load progressively
- ✅ Background color shown while loading
- ✅ Eventually all images display or fallback

---

### Test 15: Error Handling 🚨

**Test Scenario 1: Backend Down**
```
1. Stop backend server
2. Try adding item to cart
```

**Expected:**
- ❌ Error message: "Cannot connect to server. Please check if the backend is running on port 8081."
- ✅ User-friendly error snackbar
- ✅ No app crash

**Test Scenario 2: Invalid Quantity**
```
1. Manually send API request with quantity: 0
   (Use browser console or Postman)
```

**Backend Response:**
```json
{
  "message": "Quantity must be at least 1",
  "status": 400
}
```

**Frontend Handling:**
- ✅ Catches error
- ✅ Shows: "Invalid quantity or insufficient stock"
- ✅ Prevents UI update

**Test Scenario 3: Item Not Found**
```
1. Manually send API request with invalid cartItemId
```

**Frontend Handling:**
- ✅ Shows: "Cart item not found"
- ✅ Refreshes cart to sync state

**Test Scenario 4: Insufficient Stock**
```
1. Find product with low stock (e.g., 2 items)
2. Add to cart with quantity 1
3. Try incrementing to 5
```

**Expected:**
- ❌ Backend returns 400 error
- ✅ Frontend shows: "Insufficient stock"
- ✅ Quantity stays at available stock

---

### Test 16: Session Persistence 💾

**Test Scenario 1: Refresh Page**
```
1. Add items to cart
2. Refresh page (F5)
```

**Expected:**
- ✅ User still logged in (token in localStorage)
- ✅ Cart items still present
- ✅ Fetches cart from backend on mount

**Test Scenario 2: Close and Reopen Browser**
```
1. Add items to cart
2. Close browser
3. Reopen and navigate to app
```

**Expected:**
- ✅ Token persists (localStorage)
- ✅ User auto-logged in
- ✅ Cart items restored from backend

**Test Scenario 3: Logout and Login**
```
1. Add items to cart
2. Logout
3. Login again
```

**Expected:**
- ✅ Cart associated with user account
- ✅ Items persist after re-login
- ✅ Cart fetched from backend

---

## 📊 Test Results Template

### Copy and Fill This:

```markdown
## Test Results - [Date]

### Environment
- Backend: [Running / Not Running]
- Frontend: [Running / Not Running]
- Browser: [Chrome / Firefox / Edge / Safari]
- PostgreSQL: [Running / Not Running]

### Test 1: Product Listing
- [ ] ✅ Products display
- [ ] ✅ Images load
- [ ] ❌ Issue: [describe if failed]

### Test 2: Search Functionality
- [ ] ✅ Search "milk" works
- [ ] ✅ Search "apple" works
- [ ] ✅ Search "chips" works
- [ ] ❌ Issue: [describe if failed]

### Test 3: Add to Cart (Not Logged In)
- [ ] ✅ Redirects to login
- [ ] ✅ Shows warning message
- [ ] ❌ Issue: [describe if failed]

### Test 4: User Authentication
- [ ] ✅ Login successful
- [ ] ✅ Token stored
- [ ] ❌ Issue: [describe if failed]

### Test 5: Add Product to Cart
- [ ] ✅ Item added
- [ ] ✅ Success message shown
- [ ] ✅ No duplicates
- [ ] ❌ Issue: [describe if failed]

### Test 6: Increment Quantity
- [ ] ✅ Quantity increases
- [ ] ✅ Total updates
- [ ] ✅ API call correct
- [ ] ❌ Issue: [describe if failed]

### Test 7: Decrement Quantity
- [ ] ✅ Quantity decreases
- [ ] ✅ Total updates
- [ ] ❌ Issue: [describe if failed]

### Test 8: Decrement at Minimum
- [ ] ✅ Button disabled at quantity 1
- [ ] ✅ No API call made
- [ ] ❌ Issue: [describe if failed]

### Test 9: Manual Quantity Input
- [ ] ✅ Valid input works
- [ ] ✅ Invalid input blocked
- [ ] ✅ Defaults to 1 for invalid
- [ ] ❌ Issue: [describe if failed]

### Test 10: Remove Item
- [ ] ✅ Item removed
- [ ] ✅ Cart updates
- [ ] ❌ Issue: [describe if failed]

### Test 11: Add Same Product Twice
- [ ] ✅ Quantity increments
- [ ] ✅ No duplicate items
- [ ] ❌ Issue: [describe if failed]

### Test 12: Category Filtering
- [ ] ✅ Dairy filter works
- [ ] ✅ Fruits filter works
- [ ] ❌ Issue: [describe if failed]

### Test 13: Featured Products
- [ ] ✅ Shows featured items
- [ ] ❌ Issue: [describe if failed]

### Test 14: Image Loading
- [ ] ✅ Valid URLs load
- [ ] ✅ Invalid URLs show placeholder
- [ ] ❌ Issue: [describe if failed]

### Test 15: Error Handling
- [ ] ✅ Backend down handled
- [ ] ✅ Invalid quantity handled
- [ ] ✅ Item not found handled
- [ ] ❌ Issue: [describe if failed]

### Test 16: Session Persistence
- [ ] ✅ Refresh preserves cart
- [ ] ✅ Reopen browser preserves session
- [ ] ❌ Issue: [describe if failed]

### Overall Status
- Total Tests: 16
- Passed: [X]
- Failed: [Y]
- Success Rate: [X/16 * 100]%

### Critical Issues Found
1. [Issue 1 description]
2. [Issue 2 description]

### Notes
[Any additional observations]
```

---

## 🐛 Common Issues and Solutions

### Issue 1: Backend Not Starting

**Symptoms:**
- Port 8081 already in use
- Database connection failed

**Solutions:**
```powershell
# Check if port 8081 is in use
netstat -ano | findstr :8081

# Kill process using port 8081
taskkill /PID [PID_NUMBER] /F

# Verify PostgreSQL is running
psql -U postgres -d grocerydb
```

---

### Issue 2: Frontend Not Connecting to Backend

**Symptoms:**
- CORS errors in console
- "Cannot connect to server" errors

**Solutions:**
```powershell
# Verify backend is running
curl http://localhost:8081/api/v1/products

# Check frontend API_BASE_URL in baseApi.js
# Should be: http://localhost:8081/api/v1

# Verify CORS enabled in CartController.java
@CrossOrigin(origins = "*")
```

---

### Issue 3: Images Not Loading

**Symptoms:**
- Broken image icons
- 404 errors for images

**Solutions:**
```powershell
# Verify images were updated in database
psql -U postgres -d grocerydb
SELECT id, name, image_url FROM products LIMIT 5;

# Expected: image_url starts with https://images.unsplash.com/

# If not updated, run:
\i UPDATE_PRODUCT_IMAGES.sql
```

---

### Issue 4: Cart Items Not Updating

**Symptoms:**
- Clicking [+] or [-] does nothing
- Quantity doesn't change

**Solutions:**
```javascript
// Check browser console for errors
// Look for:
"❌ Update cart item failed"

// Check Redux DevTools:
// Action: UPDATE_CART_ITEM_REQUEST
// Should be followed by: UPDATE_CART_ITEM_SUCCESS

// Verify cartItemId is being passed correctly
console.log('Cart Item ID:', item.cartItemId);
```

---

### Issue 5: Authentication Issues

**Symptoms:**
- "User not found" errors
- Redirected to login repeatedly

**Solutions:**
```javascript
// Check localStorage for token
localStorage.getItem('token')
// Should return JWT string

// Check user object
localStorage.getItem('user')
// Should return user JSON

// If missing, clear and re-login:
localStorage.clear()
// Then login again
```

---

## 📸 Screenshots to Capture

### For Documentation

1. **Products Grid:**
   - Homepage with all products
   - Various product cards with images

2. **Search Results:**
   - Search for "milk" results
   - Search for "apple" results
   - Search for "chips" results

3. **Cart Operations:**
   - Empty cart
   - Cart with 1 item
   - Cart with multiple items
   - Increment/decrement buttons

4. **Error Handling:**
   - Validation error message
   - Network error message
   - Success snackbar

5. **Console Logs:**
   - API requests logging
   - Successful responses
   - Error responses

---

## ✅ Success Criteria

### Application is Working Correctly When:

- ✅ All 801 products display with Unsplash images
- ✅ Search returns relevant results for any keyword
- ✅ Add to cart creates cart items with quantity 1
- ✅ Increment increases quantity (no duplicates)
- ✅ Decrement decreases quantity (disabled at 1)
- ✅ Manual input validates and updates correctly
- ✅ Remove deletes items from cart
- ✅ All prices and totals calculate correctly
- ✅ Error messages are clear and helpful
- ✅ No console errors during normal usage
- ✅ Session persists across page refreshes
- ✅ Images fallback to placeholder on error

---

## 📞 Support

### If Issues Persist

1. **Check Backend Logs:**
   ```
   Terminal where backend is running
   Look for ERROR or WARN messages
   ```

2. **Check Frontend Console:**
   ```
   F12 → Console tab
   Look for red error messages
   Screenshot and analyze
   ```

3. **Check Database:**
   ```powershell
   psql -U postgres -d grocerydb
   SELECT COUNT(*) FROM products;
   # Should return 801
   
   SELECT COUNT(*) FROM products WHERE image_url LIKE 'https://images.unsplash.com%';
   # Should return 801
   ```

4. **Review Documentation:**
   - `FRONTEND_VALIDATION_REPORT.md` - Frontend analysis
   - `API_VALIDATION_REPORT.md` - Backend testing results
   - `FIXES_APPLIED.md` - All fixes made
   - `FRONTEND_API_DOCUMENTATION.md` - API reference

---

**Happy Testing! 🚀**

If you find any issues during testing, please document them in the Test Results Template above and refer to the Common Issues section for solutions.
