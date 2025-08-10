# Data Model

## Overview
The data model for the anonymous systems app is designed to efficiently
store and manage user information. The primary database used is Firestore
and primary storage is Firebase Storage.

## Collections and Documents
### 1. Users Collection
- **Path:** `users/{userId}`

#### Firestore Fields
- `avatar`: _string_ or _null_ — URL of the user's avatar image
- `firstName`: _string_ — User's first name
- `lastName`: _string_ — User's last name
- `username`: _string_ — Unique username for the user

#### Storage Files
- `avatar`: Image file — User's uploaded avatar image
