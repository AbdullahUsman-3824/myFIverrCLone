## 🔍 Workflow Summary

| Step | Endpoint | Method | Notes |
|------|----------|--------|-------|
| 1 | `/api/auth/registration/` | `POST` | Create user with buyer/seller role |
| 2 | `/api/auth/login/` | `POST` | Login and get token |
| 3 | `/api/auth/user/` | `GET` | Get current user details |
| 4 | `/api/accounts/profile/buyer-setup/` | `PATCH` | Submit bio, picture, location, languages |
| 5 | `/api/accounts/user/become-seller/` | `POST` | Upgrade to seller |
| 6 | `/api/accounts/profile/seller-setup/` | `PATCH` | Submit education, skills, portfolio |
| 7 | `/api/accounts/user/switch-role/` | `POST` | Switch session role |
| 8 | `/api/accounts/profile/complete/` | `GET` | View complete profile |

---

## 🧪 Step-by-Step Working

### ✅ 1. Register a New User

**Endpoint**: `POST /api/auth/registration/`

**Body:**

```json
{
  "username": "muhammad123",
  "email": "abdullah@example.com",
  "password1": "SecurePassword123!",
  "password2": "SecurePassword123!",
  "first_name": "Muhammad",
  "last_name": "Usman",
  "is_buyer": true,
  "is_seller": false
}
```

Expected: 201 CREATED + `user` object

---

### ✅ 2. Login

**Endpoint**: `POST /api/auth/login/`

**Body:**

```json
{
  "email": "abdullah@example.com",
  "password": "SecurePassword123!"
}
```

Expected: 200 OK + Access token

---

### ✅ 3. Get Current User

**Endpoint**: `GET /api/auth/user/`  
**Headers**: `Authorization: Token <your-token>`

Expected: All user fields + roles (`is_buyer`, `is_seller`, `current_role`)

---

### ✅ 4. Buyer Profile Setup

**Endpoint**: `PATCH /api/accounts/profile/buyer-setup/`  
**Headers**: `Authorization: Token ...`  
**Body:**

```json
{
  "first_name": "Muhammad",
  "last_name": "Usman",
  "username": "muhammad123",
  "bio": "Web dev from Okara.",
  "location": "Okara",
  "languages": [
    { "name": "English", "level": "fluent" },
    { "name": "Urdu", "level": "native" }
  ]
}
```

Expected: 200 OK + updated profile

---

### ✅ 5. Become a Seller

**Endpoint**: `POST /api/accounts/user/become-seller/`

Expected:
```json
{
  "message": "You are now a seller"
}
```

---

### ✅ 6. Seller Profile Setup

**Endpoint**: `PATCH /api/accounts/profile/seller-setup/`  
**Body:**

```json
{
  "portfolio_link": "https://github.com/muhammad",
  "educations": [
    {
      "institution_name": "PU Lahore",
      "degree_title": "BSCS",
      "start_year": 2020,
      "end_year": 2024
    }
  ],
  "skills": [
    { "name": "Django", "level": "expert" },
    { "name": "React", "level": "intermediate" }
  ],
  "portfolio_items": [
    {
      "title": "Fiverr Clone",
      "description": "Built with Django and React",
      "url_link": "https://github.com/muhammad/fiverr-clone"
    }
  ]
}
```

Expected: 200 OK + updated seller info

---

### ✅ 7. Switch Role

**Endpoint**: `POST /api/accounts/user/switch-role/`  
**Body:**
```json
{ "role": "seller" }
```

Expected: current_role is now `seller`

---

### ✅ 8. Get Complete Profile

**Endpoint**: `GET /api/accounts/profile/complete/`  
Returns:
- All `User` fields
- `Profile` fields
- Nested: languages, skills, educations, portfolio

---
