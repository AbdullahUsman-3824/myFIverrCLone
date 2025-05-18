## 🔍 Authentication & Profile Workflow

| Step | Endpoint                                   | Method  | Description                                 |
| ---- | ------------------------------------------ | ------- | ------------------------------------------- |
| 1    | `/api/auth/register/`                      | `POST`  | Initial registration with username/password |
| 2    | `/api/auth/login/`                         | `POST`  | Login and get JWT tokens                    |
| 3    | `/api/auth/user/`                          | `GET`   | Get current user details                    |
| 4    | `/api/auth/verify-email/`                  | `POST`  | Request email verification                  |
| 5    | Email Link                                 | `GET`   | Verify email via link                       |
| 6    | `/api/accounts/profile/setup/`             | `PATCH` | Complete user profile                       |
| 7    | `/api/accounts/become-seller/`             | `POST`  | Convert to seller role                      |
| 8    | `/api/accounts/switch-role/`               | `POST`  | Switch between buyer/seller roles           |
| 9    | `/api/accounts/seller/profile/setup/`      | `PATCH` | Setup seller profile                        |
| 10   | `/api/accounts/seller/profile/completion/` | `GET`   | Check profile completion status             |

---

## 🧪 Step-by-Step Implementation

### ✅ 1. Initial Registration

**Endpoint**: `POST /api/auth/registration/`

**Body:**

```json
{
  "username": "username123",
  "email":"test@example.com",
  "password1": "SecurePassword123!",
  "password2": "SecurePassword123!"
}
```

**Response**:

```json
{
  "user": {
    "id": 1,
    "username": "username123",
    "is_email_verified": false,
    "is_seller": false,
    "current_role": "buyer",
    "is_profile_set": false
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1..."
}
```

---

### ✅ 2. Login

**Endpoint**: `POST /api/auth/login/`

**Body:**

```json
{
  "login_identifier": "username123",
  "password": "SecurePassword123!"
}
```

**Response**:

```json
{
  "user": {
    "id": 1,
    "username": "username123",
    "is_email_verified": false,
    "is_seller": false,
    "current_role": "buyer",
    "is_profile_set": false
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1..."
}
```

---

### ✅ 3. Get Current User

**Endpoint**: `GET /api/auth/user/`  
**Headers**: `Authorization: Bearer <access_token>`

**Response**:

```json
{
  "id": 1,
  "username": "username123",
  "is_email_verified": false,
  "is_seller": false,
  "current_role": "buyer",
  "is_profile_set": false,
  "date_joined": "2024-03-15T10:30:00Z"
}
```

---

### ✅ 4. Request Email Verification

**Endpoint**: `POST /api/auth/verify-email/`  
**Headers**: `Authorization: Bearer <access_token>`

**Body:**

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "message": "Verification email sent",
  "email": "user@example.com"
}
```

---

### ✅ 5. Email Verification Link

- User clicks link in email
- Email marked as verified
- User's `is_email_verified` status updated

---

### ✅ 6. Complete User Profile

**Endpoint**: `PATCH /api/accounts/profile/setup/`  
**Headers**: `Authorization: Bearer <access_token>`

**Body:**

```json
{
  "email": "user@example.com",
  "first_name": "First",
  "last_name": "Last",
  "profile_picture": "file" // optional
}
```

**Response**:

```json
{
  "id": 1,
  "username": "username123",
  "email": "user@example.com",
  "first_name": "First",
  "last_name": "Last",
  "is_email_verified": true,
  "is_seller": false,
  "current_role": "buyer",
  "is_profile_set": true,
  "profile_picture": "url/to/picture.jpg",
  "date_joined": "2024-03-15T10:30:00Z"
}
```

---

### ✅ 7. Seller Profile Setup

**Endpoint**: `PATCH /api/accounts/seller/profile/setup/`  
**Headers**: `Authorization: Bearer <access_token>`

**Body:**

```json
{
  "profile_title": "Full Stack Developer",
  "bio": "Experienced developer specializing in Django and React",
  "location": "New York, USA",
  "portfolio_link": "https://github.com/username",
  "educations": [
    {
      "institution_name": "University of Technology",
      "degree_title": "BSc Computer Science",
      "start_year": 2020,
      "end_year": 2024
    }
  ],
  "skills": [
    { "name": "Django", "level": "expert" },
    { "name": "React", "level": "intermediate" }
  ],
  "languages": [
    { "name": "English", "level": "fluent" },
    { "name": "Spanish", "level": "conversational" }
  ],
  "portfolio_items": [
    {
      "title": "E-commerce Platform",
      "description": "Built with Django and React",
      "url_link": "https://github.com/username/project"
    }
  ]
}
```

---

### ✅ 8. Become Seller

**Endpoint**: `POST /api/accounts/become-seller/`  
**Headers**: `Authorization: Bearer <access_token>`

**Response**:

```json
{
  "status": "success",
  "message": "You are now a seller",
  "user": {
    "is_seller": true,
    "current_role": "seller"
  }
}
```

---

### ✅ 9. Switch Role

**Endpoint**: `POST /api/accounts/switch-role/`  
**Headers**: `Authorization: Bearer <access_token>`

**Body**:

```json
{
  "role": "seller" // or "buyer"
}
```

**Response**:

```json
{
  "status": "success",
  "message": "Role switched to seller",
  "user": {
    "current_role": "seller"
  }
}
```

---

### ✅ 10. Check Profile Completion

**Endpoint**: `GET /api/accounts/seller/profile/completion/`  
**Headers**: `Authorization: Bearer <access_token>`

**Response**:

```json
{
  "is_complete": false,
  "missing_fields": ["profile_title", "educations", "portfolio_items"],
  "profile": {
    // Complete profile data
  }
}
```

---

## 🔒 Security Notes

1. **Email Verification**

   - Required for accessing protected resources
   - Verification link expires in 3 days
   - Cooldown period of 3 minutes between verification attempts

2. **JWT Authentication**

   - Access token expires in 60 minutes
   - Refresh token expires in 24 hours
   - Tokens stored in HTTP-only cookies
   - CSRF protection enabled

3. **Rate Limiting**

   - Registration: 3 attempts per hour
   - Login: 5 attempts per minute
   - Email verification: 3 attempts per hour

4. **Password Requirements**
   - Minimum length: 10 characters
   - Must include letters and numbers
   - Common passwords not allowed
   - Maximum similarity to user attributes: 70%

---

## 📧 Email Templates

Located in `templates/email/`:

- `email_confirmation_message.txt`: Email verification body
- `email_confirmation_subject.txt`: Email verification subject
- `password_reset_message.txt`: Password reset body
- `password_reset_subject.txt`: Password reset subject
