# Security Specification (TDD) for Finance Bridge Firestore

## 1. Data Invariants
- **Identity Integrity**: A user can only access (read, write) their own user document under `/users/{userId}` where `userId` matches the authenticated `request.auth.uid`.
- **Verified User Enforcements**: Since this app contains critical simulation wallets, only authenticated users are allowed access.
- **Type Safety**: The user profile properties (`username`, `xp`, `level`, `streak`, `cash`, `completedLessons`, `portfolio`, `transactions`, `portfolioHistory`) must conform strictly to their respective structural formats.

## 2. The "Dirty Dozen" Payloads (Attacks on Identity & Integrity)
Below are 12 specific hostile payloads designed to compromise the security or integrity of our user records:

1. **Identity Spoofing - Document Level**: Authenticated user `attacker_123` attempts to write directly to `/users/victim_789`.
2. **Identity Spoofing - Content Owner**: Authenticated user `attacker_123` attempts to set someone else's ID or write without passing their own credentials.
3. **Ghost Field / Shadow Field Injection**: Attempting to inject a non-whitelisted variable `isAdmin: true` into the profile document to escalate privileges.
4. **Denial of Wallet ID Poisoning**: Trying to create a profile where the ID is an excessively long string (e.g., 2000 characters) or contains malicious script/SQL injection strings.
5. **XP Value Poisoning**: Trying to write a string `"one million"` into the `xp` field.
6. **Cash Value Poisoning**: Attempting to set cash to negative or a non-numeric type like `null` or a giant nested Map.
7. **Empty Username**: Writing a profile with an empty `username` or a username larger than 100 characters.
8. **Malicious Array Injection**: Injecting a custom huge array into `completedLessons` containing raw scripts or infinite objects.
9. **Level Value Poisoning**: Trying to write a float or negative number for `level`.
10. **Unauthenticated Read Access**: Attempting to retrieve a user profile without being logged in.
11. **Unauthenticated Write Access**: Attempting to modify or create a user profile without being logged in.
12. **Streak Abuse**: Writing an invalid or extremely large/negative integer into `streak`.

## 3. Security Tests Specifications (Test Rules Target)
Any correct ruleset MUST reject all 12 of these hostile actions.

We draft the `firestore.rules` structure to guarantee absolute isolation of user profiles:
- Only owner access.
- Non-owners get `PERMISSION_DENIED`.
