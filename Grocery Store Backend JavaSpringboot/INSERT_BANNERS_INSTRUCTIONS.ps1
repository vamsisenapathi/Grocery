# ONE-LINE BANNER INSERT
# Copy and paste this entire command into PowerShell

# Make sure you're in the backend directory first:
# cd "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"

# Then run this command (replace 'yourpassword' with your PostgreSQL password):
$env:PGPASSWORD='yourpassword'; psql -U postgres -d grocerydb -f QUICK_BANNER_INSERT.sql; $env:PGPASSWORD=$null

# Alternative: If the above doesn't work, try this:
# psql -U postgres -d grocerydb
# Then manually paste the contents of QUICK_BANNER_INSERT.sql

Write-Host @"

==================================================
BANNER INSERTION - QUICK GUIDE
==================================================

METHOD 1: Using psql command line
--------------------------------------------------
1. Open PowerShell
2. Navigate to backend directory:
   cd "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"

3. Run this command:
   psql -U postgres -d grocerydb -f QUICK_BANNER_INSERT.sql

4. Enter your PostgreSQL password when prompted

METHOD 2: Using pgAdmin (GUI)
--------------------------------------------------
1. Open pgAdmin
2. Connect to your grocerydb database
3. Click Tools → Query Tool
4. Open file: QUICK_BANNER_INSERT.sql
5. Click Execute (F5)

METHOD 3: Direct connection
--------------------------------------------------
1. psql -U postgres -d grocerydb
2. Copy/paste SQL from QUICK_BANNER_INSERT.sql
3. Press Enter

==================================================
AFTER INSERTION:
--------------------------------------------------
1. Restart your Spring Boot backend
2. Refresh your React frontend
3. Banners should appear on homepage!

==================================================
TROUBLESHOOTING:
--------------------------------------------------
- If psql command not found: Add PostgreSQL bin folder to PATH
- If connection refused: Make sure PostgreSQL is running
- If database not found: Create it first with createdb grocerydb
- If password fails: Check your PostgreSQL credentials

==================================================

"@ -ForegroundColor Cyan
