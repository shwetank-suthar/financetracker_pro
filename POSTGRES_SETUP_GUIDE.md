# FinanceTracker Pro - PostgreSQL Setup Guide

This guide will help you set up your local PostgreSQL database for FinanceTracker Pro.

## Prerequisites

1. **PostgreSQL 12+** installed on your system
2. **psql** command-line tool (usually comes with PostgreSQL)
3. **Database creation privileges**

## Quick Setup

### Step 1: Create Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE financetracker;

# Exit psql
\q
```

### Step 2: Run Setup Script

```bash
# Run the complete setup script
psql -U postgres -d financetracker -f setup-local-postgres.sql
```

### Step 3: Verify Installation

```bash
# Connect to the database
psql -U postgres -d financetracker

# Check tables
\dt

# Check sample data
SELECT * FROM users;
SELECT * FROM accounts;

# Exit
\q
```

## Database Connection Details

- **Host**: localhost
- **Port**: 5432 (default)
- **Database**: financetracker
- **Username**: postgres (or your PostgreSQL username)
- **Password**: Your PostgreSQL password

## Sample User Credentials

- **Email**: demo@financetracker.com
- **Password**: password123

**⚠️ Important**: Change this password immediately after setup!

## Application Configuration

Update your application's database connection string:

```javascript
// Example connection string
const connectionString = 'postgresql://postgres:your_password@localhost:5432/financetracker';
```

## Database Schema Overview

The setup script creates the following tables:

### Core Tables
- `users` - User accounts and profiles
- `accounts` - Bank accounts, wallets, cash
- `expenses` - Expense transactions
- `investments` - Investment portfolio
- `budgets` - Budget tracking
- `transactions` - Account transaction history

### Advanced Features
- `income_sources` - Income source management
- `salaries` - Salary tracking and deductions
- `salary_deductions` - Automatic salary deductions
- `sip_entries` - SIP investment tracking
- `categories` - Expense categories
- `payment_methods` - Payment method options

### Views and Functions
- `sip_summary` - SIP investment summary view
- `get_salary_summary()` - Salary summary function
- `get_sip_progress()` - SIP progress tracking
- `get_upcoming_sips()` - Upcoming SIP dates

## Features Included

✅ **Complete Expense Tracking**
- Categories and payment methods
- Receipt attachments
- Tags and notes

✅ **Investment Portfolio Management**
- Multiple investment types
- Real-time value tracking
- Gain/loss calculations

✅ **SIP (Systematic Investment Plan) Support**
- SIP entry tracking
- Progress monitoring
- Upcoming SIP notifications

✅ **Salary and Income Tracking**
- Multiple income sources
- Automatic salary deductions
- Balance tracking

✅ **Budget Management**
- Category-based budgets
- Spending limits
- Progress tracking

✅ **Account Management**
- Multiple account types
- Balance tracking
- Transaction history

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Make sure you're using a superuser account
   psql -U postgres -d financetracker -f setup-local-postgres.sql
   ```

2. **Database Already Exists**
   ```bash
   # Drop and recreate if needed
   DROP DATABASE financetracker;
   CREATE DATABASE financetracker;
   ```

3. **Extensions Not Available**
   ```bash
   # Install required extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

### Reset Database

If you need to start fresh:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS financetracker;"
psql -U postgres -c "CREATE DATABASE financetracker;"
psql -U postgres -d financetracker -f setup-local-postgres.sql
```

## Security Notes

1. **Change Default Passwords**: Update the sample user password
2. **Create Application User**: Create a dedicated user for your application
3. **Limit Permissions**: Grant only necessary permissions to application user
4. **Enable SSL**: Configure SSL for production use

## Next Steps

1. **Update Application**: Modify your app to use PostgreSQL instead of Supabase
2. **Authentication**: Implement local authentication system
3. **Backup Strategy**: Set up regular database backups
4. **Monitoring**: Configure database monitoring and logging

## Support

If you encounter any issues:

1. Check PostgreSQL logs
2. Verify user permissions
3. Ensure all extensions are installed
4. Check database connection settings

---

**Database Setup Complete!** 🎉

Your FinanceTracker Pro database is now ready for local development and production use.
