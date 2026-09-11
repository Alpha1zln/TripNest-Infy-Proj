## M1StepsbyApznCgPart2

####  
Step 5E — BCrypt Password Hashing

Currently, our registration flow only checks:

Email exists?
   ↓
Yes → reject
No  → continue

Eventually we need:

User enters:
password123
      ↓
    BCrypt
      ↓
$2a$10$..............
      ↓
Store HASH in PostgreSQL

We never store:

password123
1. First understand BCrypt

BCrypt is a password-hashing algorithm.

It is deliberately designed to be computationally expensive, making large-scale password guessing harder.

Also, BCrypt uses a salt, so even if two users choose:

password123

their stored hashes can be different.

For example:

User A → password123 → $2a$10$abc...
User B → password123 → $2a$10$xyz...

That's good.

Important distinction

BCrypt is hashing, not encryption.

Encryption:
data → encrypted data → can be decrypted

Hashing:
data → hash → you don't decrypt it

During login, we'll use BCrypt to compare the entered password with the stored hash.

2. Create a PasswordEncoder Bean

We'll let Spring manage our BCrypt encoder.

Create/open:

config/SecurityConfig.java

Add:

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

Then inside SecurityConfig add:

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

So currently your class should look like:

package com.tripnest.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
🧠 What's a Bean here?

This:

@Bean
public PasswordEncoder passwordEncoder()

tells Spring:

"Create a PasswordEncoder object and keep it in the Spring container so other classes can use it."

Then later our AuthService can simply receive:

PasswordEncoder passwordEncoder

through constructor injection.

So:

Spring Container
      │
      ├── AuthService
      │
      ├── UserRepository
      │
      └── PasswordEncoder
                ↓
          BCryptPasswordEncoder

This is another good Spring Dependency Injection concept.

3. Don't hash anything yet

For this step, only create the bean and compile.

Run:

mvn clean compile

If you get:

BUILD SUCCESS

stop there.

Next tiny step

We'll inject this:

PasswordEncoder

into:

AuthService

and actually hash the password.

Then we'll be able to inspect the result and see that:

password123

never goes into PostgreSQL as plain text. 🔐

Do this step and tell me BUILD SUCCESS.

---------------

Excellent. 👍 Now we'll actually use BCrypt. One small step only.

Step 5F — Inject PasswordEncoder into AuthService

We already created the BCrypt bean:

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

Now Spring can give that object to our service.

1. Modify AuthService

Change the constructor from:

public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
}

to:

private final PasswordEncoder passwordEncoder;

public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}

And add the import:

import org.springframework.security.crypto.password.PasswordEncoder;

So the relevant part becomes:

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ...
}
🧠 What's happening?

Spring sees:

AuthService needs
      ↓
PasswordEncoder
      ↓
Spring Container
      ↓
BCryptPasswordEncoder

So we don't do:

new BCryptPasswordEncoder()

inside the service.

Spring provides it to us. This is Dependency Injection.

2. Don't hash yet

For now, just make this change and run:

mvn clean compile

We haven't changed the registration logic yet.

Once you get BUILD SUCCESS, tell me.

Then the next step will be tiny:

request.getPassword() → passwordEncoder.encode(...)

That's where you'll actually see BCrypt in action. 🔐

-------------

Excellent. 👍 Now we'll actually use BCrypt. One small step only.

Step 5F — Inject PasswordEncoder into AuthService

We already created the BCrypt bean:

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

Now Spring can give that object to our service.

1. Modify AuthService

Change the constructor from:

public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
}

to:

private final PasswordEncoder passwordEncoder;

public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}

And add the import:

import org.springframework.security.crypto.password.PasswordEncoder;

So the relevant part becomes:

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ...
}
🧠 What's happening?

Spring sees:

AuthService needs
      ↓
PasswordEncoder
      ↓
Spring Container
      ↓
BCryptPasswordEncoder

So we don't do:

new BCryptPasswordEncoder()

inside the service.

Spring provides it to us. This is Dependency Injection.

2. Don't hash yet

For now, just make this change and run:

mvn clean compile

We haven't changed the registration logic yet.

Once you get BUILD SUCCESS, tell me.

Then the next step will be tiny:

request.getPassword() → passwordEncoder.encode(...)

That's where you'll actually see BCrypt in action. 🔐

----------

Great. Now we do the actual BCrypt hashing. 🔐

Step 5G — Hash the Password

In AuthService.register(), currently you have something like:

if (userRepository.existsByEmail(request.getEmail())) {
    return "Email already registered";
}

return "Email is available for registration";

For now, replace the final return with:

String hashedPassword = passwordEncoder.encode(request.getPassword());

return "Hashed password: " + hashedPassword;

So:

public String register(RegistrationRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        return "Email already registered";
    }

    String hashedPassword = passwordEncoder.encode(request.getPassword());

    return "Hashed password: " + hashedPassword;
}
🧠 What is happening?

If Postman sends:

password123

your service does:

"password123"
       ↓
passwordEncoder.encode()
       ↓
BCrypt
       ↓
"$2a$10$................"

We are NOT saving it to PostgreSQL yet.

We're deliberately stopping here so you can see what BCrypt actually produces.

Test it

Run the application and send:

{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

You should get a response containing something like:

Hashed password: $2a$10$...

If you send the same password again, you'll likely get a different hash because BCrypt uses a random salt. That's a very useful thing to observe.

Do this and tell me what response you get. Then we'll move to creating the User entity from the DTO and actually saving it to PostgreSQL.

op>>
Pw:password123, Hashed password: $2a$10$uquLlt8ekUwI0WB9c4ipM.LPZhdT9wtgzGWDMHNkM9Vx7j713nk8G

**
Ip data = 
{
    "name": "John",
    "email": "john@example.com",
    "password": "password123"
}


------------------


Perfect. 🔐 BCrypt is working exactly as expected.

You just observed:

Plain password:
password123

        ↓ BCrypt

Hash:
$2a$10$uquLlt8ekUwI0WB9c4ipM.LPZhdT9wtgzGWDMHNkM9Vx7j713nk8G
One important thing to understand

$2a$10$...

$2a$ → BCrypt version
10 → cost/work factor
remaining part → salt + resulting hash

And you cannot/should not decrypt this hash.

Later during login:

User enters password123
        ↓
BCrypt.matches()
        ↓
Compare with stored hash
        ↓
true / false
Next Step — Create the User object

Now we're going to stop returning the hash as a response.

We'll take:

RegistrationRequest DTO
        ↓
User entity

But don't save it yet.

In AuthService.register()

After:

String hashedPassword = passwordEncoder.encode(request.getPassword());

add:

User user = new User();
user.setName(request.getName());
user.setEmail(request.getEmail());
user.setPassword(hashedPassword);

You'll need:

import com.tripnest.backend.entity.User;

So the flow becomes:

request
   ↓
name ─────────→ user.name
email ────────→ user.email
password
   ↓
BCrypt
   ↓
hashedPassword → user.password

For now, do NOT call userRepository.save(user) yet.

We're going to inspect/understand the entity mapping first, then save it in the next step.

Run:

mvn clean compile

If BUILD SUCCESS, tell me done.


-------------

Good. Now we do the first actual database save. This is an important milestone. 🚀

Step 5H — Save User to PostgreSQL

You already have:

User user = new User();
user.setName(request.getName());
user.setEmail(request.getEmail());
user.setPassword(hashedPassword);

Now add one line:

userRepository.save(user);

So your method becomes:

public String register(RegistrationRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        return "Email already registered";
    }

    String hashedPassword = passwordEncoder.encode(request.getPassword());

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(hashedPassword);

    userRepository.save(user);

    return "User registered successfully";
}
🧠 What does save() actually do?

This is the important part:

userRepository.save(user)
        ↓
Spring Data JPA
        ↓
Hibernate
        ↓
SQL INSERT
        ↓
PostgreSQL
        ↓
users table

You don't write the INSERT SQL yourself.

Hibernate generates it based on your User entity.

🧪 Test it

Restart/run the backend.

Send in Postman:

POST http://localhost:8080/api/auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

Expected:

User registered successfully

Then open PostgreSQL:

SELECT * FROM users;

You should see something like:

id | email              | name | password
---+--------------------+------+-------------------------
1  | john@example.com   | John | $2a$10$............

🔥 This is a big checkpoint: your DTO → Controller → Service → JPA → Hibernate → PostgreSQL flow is now actually working.

Do this and tell me what SELECT * FROM users; shows. Then we'll assign the default TRAVELER role to the newly registered user.

op>>>>
tripnest_db=# SELECT * FROM users;
 id |      email       | name |                           password
----+------------------+------+--------------------------------------------------------------
  1 | john@example.com | John | $2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwhMhrEGlDzsBhtb5G7xSXHtaFIi
(1 row)

tripnest_db=# SELECT * FROM users;
 id |      email       | name |                           password
----+------------------+------+--------------------------------------------------------------
  1 | john@example.com | John | $2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwhMhrEGlDzsBhtb5G7xSXHtaFIi
(1 row)


tripnest_db=# SELECT id, name, email, password FROM users;
 id | name |      email       |                           password
----+------+------------------+--------------------------------------------------------------
  1 | John | john@example.com | $2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwhMhrEGlDzsBhtb5G7xSXHtaFIi
(1 row)

-----------

Good morning 😄☕. Welcome back, Alpha1.

We stopped at M1 → Registration → saving User. Before moving ahead, let's keep the same learning style: one small concept + implementation + test.

Where we are
POST /api/auth/register
        ↓
RegistrationRequest DTO
        ↓
AuthController
        ↓
AuthService
        ↓
check email
        ↓
BCrypt hash password
        ↓
create User
        ↓
userRepository.save(user)   ← current step
        ↓
PostgreSQL
Next 3 steps
Step 1 — Verify User was actually saved

If you haven't already, run:

SELECT id, name, email, password FROM users;

We want to confirm:

User exists
Name/email are correct
Password is a BCrypt hash, not password123

Also test duplicate registration with the same email.

Expected:

First registration  → User registered successfully
Same email again    → Email already registered
Step 2 — Assign TRAVELER role

Currently:

users
  ↓
John

But we also need:

John
 ↓
TRAVELER

Your database already has:

roles

1  TRAVELER
2  GROUP_ADMIN
3  ADMIN

We'll use RoleRepository to find TRAVELER, then create a UserRole.

Flow:

New User
   ↓
Find TRAVELER role
   ↓
Create UserRole
   ↓
user_id + role_id
   ↓
user_roles

This will teach you entity relationships + repositories + foreign keys properly.

Step 3 — Then JWT 🔥

After registration is solid, we'll move to:

LOGIN
  ↓
find user by email
  ↓
BCrypt.matches()
  ↓
password correct?
  ↓
YES
  ↓
generate JWT

Then you'll finally see the JWT you've been waiting for. 😄

So don't jump to JWT yet. First let's verify the User save + duplicate-email behavior.

Run:
SELECT id, name, email, password FROM users;
and tell me the result.

op>>>
tripnest_db=# SELECT id, name, email, password FROM users; id | name | email | password ----+------+------------------+-------------------------------------------------------------- 1 | John | john@example.com | $2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwhMhrEGlDzsBhtb5G7xSXHtaFIi (1 row)

--------

Excellent. 🔥 This is exactly what we wanted.

Your first real registration has successfully gone through the complete flow:

Postman
   ↓
RegistrationRequest DTO
   ↓
AuthController
   ↓
AuthService
   ↓
BCrypt hashing
   ↓
User entity
   ↓
UserRepository.save()
   ↓
Hibernate/JPA
   ↓
PostgreSQL

And PostgreSQL confirms:

John | john@example.com | $2a$10$...

✅ User saved
✅ Password hashed
✅ Plain password NOT stored

Next Step — Assign TRAVELER Role

Right now John exists, but:

users
  John

and separately:

roles
  TRAVELER
  GROUP_ADMIN
  ADMIN

We need to connect them through:

user_roles

Ultimately:

John
  │
  │ user_id = 1
  ↓
user_roles
  │
  │ role_id = 1
  ↓
TRAVELER
Step 1

Open your RoleRepository.

Make sure it has:

Optional<Role> findByName(String name);

You'll need:

import java.util.Optional;

So roughly:

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
🧠 Why Optional<Role>?

We're asking the database:

"Find me the role whose name is TRAVELER."

It might exist or might not exist, so Optional represents that possibility.

Conceptually:

findByName("TRAVELER")
        ↓
     Database
      ↙    ↘
   found   not found
     ↓        ↓
  Role     Optional.empty()

Don't modify AuthService yet.

Just add this repository method and compile:

mvn clean compile

If successful, tell me done.

Then we'll use it inside AuthService and create the UserRole relationship.


---------

Perfect. 👍 Now we connect the User → Role.

Step 5I — Find the TRAVELER Role

Open AuthService.

1. Add RoleRepository

Add the field:

private final RoleRepository roleRepository;

Import:

import com.tripnest.backend.repository.RoleRepository;
2. Update the constructor

You currently have:

public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder) {

Change it to:

public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   RoleRepository roleRepository) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
}

So Spring now injects three dependencies:

AuthService
   ├── UserRepository
   ├── PasswordEncoder
   └── RoleRepository
3. Find the role

After:

userRepository.save(user);

add:

Role travelerRole = roleRepository.findByName("TRAVELER")
        .orElseThrow(() -> new RuntimeException("TRAVELER role not found"));

Import:

import com.tripnest.backend.entity.Role;
🧠 What are we doing?

We're not creating another TRAVELER role.

We're retrieving the existing row:

roles
----------------
1 | TRAVELER

and putting that database record into:

travelerRole

Conceptually:

"TRAVELER"
    ↓
RoleRepository
    ↓
PostgreSQL
    ↓
Role(id=1, name="TRAVELER")
    ↓
travelerRole

Don't create UserRole yet. That's our next tiny step.

Run:

mvn clean compile

If BUILD SUCCESS → tell me done.

------------
Excellent. 👍 Now the final little piece of the User → Role relationship.

Step 5J — Create UserRole

We have both objects now:

user
 ↓
John (id = 1)

travelerRole
 ↓
TRAVELER (id = 1)

Now we connect them.

1. In AuthService

After:

Role travelerRole = roleRepository.findByName("TRAVELER")
        .orElseThrow(() -> new RuntimeException("TRAVELER role not found"));

add:

UserRole userRole = new UserRole();
userRole.setUser(user);
userRole.setRole(travelerRole);

Add the import:

import com.tripnest.backend.entity.UserRole;

So conceptually:

User
 John
  │
  │ setUser()
  ↓
UserRole
  ↑
  │ setRole()
  │
Role
TRAVELER
2. Save it

Immediately after that, add:

userRoleRepository.save(userRole);

But first we need the repository injected.

Add:

private final UserRoleRepository userRoleRepository;

Import:

import com.tripnest.backend.repository.UserRoleRepository;

And update your constructor:

public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   RoleRepository roleRepository,
                   UserRoleRepository userRoleRepository) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
    this.userRoleRepository = userRoleRepository;
}
Your flow is now becoming:
RegistrationRequest
        ↓
AuthService
        ↓
Create User
        ↓
users table
        ↓
Find TRAVELER
        ↓
Create UserRole
        ↓
user_roles table

Run:

mvn clean compile

If successful, don't test registration yet—I'll explain one important issue with our current ordering before we run it. That will teach you something useful about database transactions.


---------
Perfect. 👍 Now before testing, there's one important correction/concept.

Step 5K — Understand the registration transaction

Our current code effectively does:

save User
   ↓
find TRAVELER
   ↓
create UserRole
   ↓
save UserRole

Imagine this happens:

User saved ✅
       ↓
TRAVELER role not found ❌
       ↓
UserRole not saved

We could end up with a user who has no role.

That's not what we want.

Solution: @Transactional

We want the registration operation to behave as one unit:

BEGIN
  ↓
Create User
  ↓
Find Role
  ↓
Create UserRole
  ↓
Save UserRole
  ↓
COMMIT ✅

If something fails:

ERROR ❌
  ↓
ROLLBACK
  ↓
Nothing from the transaction is committed

This is a very important database/Spring concept.

1. Add @Transactional

In AuthService, import:

import org.springframework.transaction.annotation.Transactional;

Then put it above register():

@Transactional
public String register(RegistrationRequest request) {

That's it for this step.

🧠 Why not put it on the Controller?

Because the service layer represents the business operation.

Controller
    ↓
Service  ← @Transactional
    ↓
Repository

The whole registration business operation is therefore treated as one transaction.

2. Compile
mvn clean compile

If BUILD SUCCESS, we're ready for the fun part:

Next → 🧪 Test a NEW registration

We'll create something like:

Alice
alice@example.com
password123

Then verify both:

SELECT * FROM users;
SELECT * FROM user_roles;

You'll see the complete relationship in PostgreSQL.

Tell me done after compile.


ip>>>
{
    "name": "aln",
    "email": "aln@example.com",
    "password": "password123"
}

op>>>
tripnest_db=# SELECT * FROM users;
 id |      email       | name |                           password
----+------------------+------+--------------------------------------------------------------
  1 | john@example.com | John | $2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwhMhrEGlDzsBhtb5G7xSXHtaFIi
  2 | aln@example.com  | aln  | $2a$10$puJvKD2zoqD/R6HFM4Vw2O2bNVYLNsGP6VrAX.sSqGCYB0SKhfH6m
(2 rows)


tripnest_db=# SELECT * FROM user_roles;
 id | role_id | user_id
----+---------+---------
  1 |       1 |       2
(1 row)


tripnest_db=# SELECT * FROM roles;
 id |    name
----+-------------
  1 | TRAVELER
  2 | GROUP_ADMIN
  3 | ADMIN
(3 rows)

-----------------

Yes — and your DB result is exactly correct. ✅

users
1 | John | john@example.com
2 | aln  | aln@example.com

user_roles
1 | role_id=1 | user_id=2

So aln is currently:

aln → TRAVELER
1. What is @Transactional?
Simple definition

@Transactional tells Spring to execute a group of database operations as one transaction: either all succeed, or the whole operation is rolled back if something goes wrong.

Think of it like a single package deal.

Without transaction:

Save User          ✅
Find Role          ✅
Save UserRole      ❌

Result:
User remains in DB
but UserRole doesn't
→ incomplete registration ❌

With:

@Transactional
public String register(...) {

Spring treats them as one unit:

START TRANSACTION
       ↓
Save User          ✅
       ↓
Find TRAVELER      ✅
       ↓
Save UserRole      ❌
       ↓
ROLLBACK 🔄

The earlier User save is undone.

If everything succeeds:

START
  ↓
Save User       ✅
  ↓
Save UserRole   ✅
  ↓
COMMIT          ✅
Interview definition

You can remember:

A transaction is a unit of work that follows ACID properties, ensuring database operations are completed consistently.

@Transactional tells Spring to manage that transaction for us.

2. Why are we giving everyone TRAVELER?

Excellent question.

We are not saying everyone must permanently be a TRAVELER.

We're implementing the registration policy:

When a normal user registers, give them the default TRAVELER role.

That's why our code specifically says:

roleRepository.findByName("TRAVELER")

Because we decided:

New user registration
        ↓
Default role
        ↓
TRAVELER

This is common in applications.

3. Then how does someone become ADMIN?

That's a separate authorization/role-management decision.

For example, later we could have:

ADMIN
  ↓
creates/promotes users
  ↓
GROUP_ADMIN

Or an administrator could assign roles through an admin API.

For example:

POST /api/admin/users/2/role

with:

{
  "role": "GROUP_ADMIN"
}

Then:

user_roles

user_id | role_id
--------+--------
   2    |    1       TRAVELER
   2    |    2       GROUP_ADMIN

Depending on our design, we might allow multiple roles.

4. Why did we create 3 roles?

Because TripNest has different levels of responsibility.

TRAVELER

Normal TripNest user.

Can eventually:

Create/manage trips
Plan itinerary
Track expenses
Join groups
Manage personal profile
GROUP_ADMIN

A user with additional authority within a group/trip.

For example:

Trip: Goa 2026

Alice → GROUP_ADMIN
Bob   → TRAVELER
John  → TRAVELER

Alice could potentially manage group members, itinerary, group expenses, etc.

ADMIN

Application-level administrator.

For example:

ADMIN
 ↓
Manage users
Manage roles
Moderate content
System administration
5. Very important distinction

There are actually two different questions:

Authentication

Who are you?

JWT
 ↓
user = aln
Authorization

What are you allowed to do?

aln
 ↓
TRAVELER
 ↓
allowed actions

Later:

JWT
 ↓
aln
 ↓
roles
 ↓
TRAVELER / GROUP_ADMIN / ADMIN
 ↓
Spring Security
 ↓
Allow / Deny

That's the part we're eventually going to implement with RBAC.

And one thing I want you to notice

You asked:

"Why only TRAVELER?"

That is exactly the kind of question you should be asking while implementing instead of blindly copying code. 😄

We're deliberately making normal registration → TRAVELER for now.

Next step: we'll verify the role assignment in Java properly and then move toward login + BCrypt password verification → JWT generation. 🔥

---------

Yep. 👍 Now that registration + BCrypt + role assignment + transaction are working, let's move to Login.

But first, one small preparation step.

Step 6A — Find User by Email

During login, the user will send:

email
password

We need to find that user in PostgreSQL.

The flow will eventually be:

POST /api/auth/login
        ↓
email + password
        ↓
UserRepository
        ↓
find user by email
        ↓
BCrypt.matches()
        ↓
password correct?
        ↓
JWT 🔥
1. Open UserRepository

Add:

Optional<User> findByEmail(String email);

And import:

import java.util.Optional;

Your repository should now have both:

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
🧠 Why Optional<User>?

Because the email might not exist.

findByEmail("aln@example.com")
          ↓
       found ✅
          ↓
       User

But:

findByEmail("xyz@example.com")
          ↓
       not found ❌
          ↓
Optional.empty()

This is safer than returning null and potentially getting a NullPointerException.

2. Compile
mvn clean compile

That's all for this step.

Next step after this: we'll create LoginRequest DTO and then implement the actual password verification using:

passwordEncoder.matches(rawPassword, storedHash)

That's where you'll see how BCrypt login works. 🔐

----------

Yes — and your DB result is exactly correct. ✅

users
1 | John | john@example.com
2 | aln  | aln@example.com

user_roles
1 | role_id=1 | user_id=2

So aln is currently:

aln → TRAVELER
1. What is @Transactional?
Simple definition

@Transactional tells Spring to execute a group of database operations as one transaction: either all succeed, or the whole operation is rolled back if something goes wrong.

Think of it like a single package deal.

Without transaction:

Save User          ✅
Find Role          ✅
Save UserRole      ❌

Result:
User remains in DB
but UserRole doesn't
→ incomplete registration ❌

With:

@Transactional
public String register(...) {

Spring treats them as one unit:

START TRANSACTION
       ↓
Save User          ✅
       ↓
Find TRAVELER      ✅
       ↓
Save UserRole      ❌
       ↓
ROLLBACK 🔄

The earlier User save is undone.

If everything succeeds:

START
  ↓
Save User       ✅
  ↓
Save UserRole   ✅
  ↓
COMMIT          ✅
Interview definition

You can remember:

A transaction is a unit of work that follows ACID properties, ensuring database operations are completed consistently.

@Transactional tells Spring to manage that transaction for us.

2. Why are we giving everyone TRAVELER?

Excellent question.

We are not saying everyone must permanently be a TRAVELER.

We're implementing the registration policy:

When a normal user registers, give them the default TRAVELER role.

That's why our code specifically says:

roleRepository.findByName("TRAVELER")

Because we decided:

New user registration
        ↓
Default role
        ↓
TRAVELER

This is common in applications.

3. Then how does someone become ADMIN?

That's a separate authorization/role-management decision.

For example, later we could have:

ADMIN
  ↓
creates/promotes users
  ↓
GROUP_ADMIN

Or an administrator could assign roles through an admin API.

For example:

POST /api/admin/users/2/role

with:

{
  "role": "GROUP_ADMIN"
}

Then:

user_roles

user_id | role_id
--------+--------
   2    |    1       TRAVELER
   2    |    2       GROUP_ADMIN

Depending on our design, we might allow multiple roles.

4. Why did we create 3 roles?

Because TripNest has different levels of responsibility.

TRAVELER

Normal TripNest user.

Can eventually:

Create/manage trips
Plan itinerary
Track expenses
Join groups
Manage personal profile
GROUP_ADMIN

A user with additional authority within a group/trip.

For example:

Trip: Goa 2026

Alice → GROUP_ADMIN
Bob   → TRAVELER
John  → TRAVELER

Alice could potentially manage group members, itinerary, group expenses, etc.

ADMIN

Application-level administrator.

For example:

ADMIN
 ↓
Manage users
Manage roles
Moderate content
System administration
5. Very important distinction

There are actually two different questions:

Authentication

Who are you?

JWT
 ↓
user = aln
Authorization

What are you allowed to do?

aln
 ↓
TRAVELER
 ↓
allowed actions

Later:

JWT
 ↓
aln
 ↓
roles
 ↓
TRAVELER / GROUP_ADMIN / ADMIN
 ↓
Spring Security
 ↓
Allow / Deny

That's the part we're eventually going to implement with RBAC.

And one thing I want you to notice

You asked:

"Why only TRAVELER?"

That is exactly the kind of question you should be asking while implementing instead of blindly copying code. 😄

We're deliberately making normal registration → TRAVELER for now.

Next step: we'll verify the role assignment in Java properly and then move toward login + BCrypt password verification → JWT generation. 🔥

-------------

Yep. 👍 Now that registration + BCrypt + role assignment + transaction are working, let's move to Login.

But first, one small preparation step.

Step 6A — Find User by Email

During login, the user will send:

email
password

We need to find that user in PostgreSQL.

The flow will eventually be:

POST /api/auth/login
        ↓
email + password
        ↓
UserRepository
        ↓
find user by email
        ↓
BCrypt.matches()
        ↓
password correct?
        ↓
JWT 🔥
1. Open UserRepository

Add:

Optional<User> findByEmail(String email);

And import:

import java.util.Optional;

Your repository should now have both:

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
🧠 Why Optional<User>?

Because the email might not exist.

findByEmail("aln@example.com")
          ↓
       found ✅
          ↓
       User

But:

findByEmail("xyz@example.com")
          ↓
       not found ❌
          ↓
Optional.empty()

This is safer than returning null and potentially getting a NullPointerException.

2. Compile
mvn clean compile

That's all for this step.

Next step after this: we'll create LoginRequest DTO and then implement the actual password verification using:

passwordEncoder.matches(rawPassword, storedHash)

That's where you'll see how BCrypt login works. 🔐

-----------
erfect. 👍 Now Step 6B — Create the Login DTO.

We need a separate DTO because registration and login don't send the same information.

Registration
name
email
password
Login
email
password

So create:

src/main/java/com/tripnest/backend/dto/LoginRequest.java

package com.tripnest.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
🧠 Why a separate DTO?

Because the DTO represents the data the API expects.

RegistrationRequest
 ├── name
 ├── email
 └── password

LoginRequest
 ├── email
 └── password

This keeps the API clean and avoids sending unnecessary data.

2. Compile
mvn clean compile

If successful, tell me done.

Then we'll create:

POST /api/auth/login

and finally test:

correct password vs wrong password using BCrypt. 🔐

-----------
Excellent. 👍

Step 6C — Create the Login API

Now we'll create the endpoint, but we won't generate JWT yet. First we'll make sure the login credentials reach the service correctly.

1. Add this to AuthController

Import:

import com.tripnest.backend.dto.LoginRequest;

Then add:

@PostMapping("/login")
public ResponseEntity<String> login(
        @Valid @RequestBody LoginRequest request) {

    return ResponseEntity.ok(
            authService.login(request)
    );
}
⚠️ One thing

Your AuthController must already have AuthService injected, something like:

private final AuthService authService;

public AuthController(AuthService authService) {
    this.authService = authService;
}

If it's already there, don't create another one.

2. Add login() to AuthService

Add:

public String login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(),
            user.getPassword()
    );

    if (!passwordMatches) {
        throw new RuntimeException("Invalid email or password");
    }

    return "Login successful";
}

Import:

import com.tripnest.backend.dto.LoginRequest;
🧠 This is the important part

Notice we're NOT doing this:

request.getPassword().equals(user.getPassword())

Because:

request password
     ↓
password123

while DB contains:

$2a$10$4kKhEvxbJFU8F...

Instead:

passwordEncoder.matches(rawPassword, storedHash)

does:

password123
     +
stored BCrypt hash
     ↓
   BCrypt
     ↓
true / false
This is the login flow now:
email + password
       ↓
findByEmail()
       ↓
User
       ↓
BCrypt.matches()
       ↓
   ┌───┴───┐
 true     false
  ↓         ↓
login     reject
3. Compile
mvn clean compile

Don't test JWT yet.

Once compilation succeeds, we'll test three cases:

Correct email + password → ✅
Correct email + wrong password → ❌
Unknown email → ❌

Then comes the big step: JWT generation. 🔥

-------

Great. 👍 Step 6D — Test Login before JWT

We want to prove that our authentication logic works before adding JWT.

1. Start the backend

From your code_Backend\ver1.2 folder:

mvn spring-boot:run

Wait for:

Tomcat started on port 8080
Started BackendApplication
2. Postman → Login

Method: POST

URL:

http://localhost:8080/api/auth/login

Body → raw → JSON:

{
  "email": "aln@example.com",
  "password": "password123"
}
Expected result
200 OK

Login successful
3. Now deliberately give the wrong password
{
  "email": "aln@example.com",
  "password": "wrongpassword"
}

You should get an error.

Then test an unknown email:

{
  "email": "doesnotexist@example.com",
  "password": "password123"
}

Again, it should fail.

🧠 What you have just demonstrated
Registration
    ↓
BCrypt hash stored in PostgreSQL
    ↓
Login request
    ↓
Find user by email
    ↓
BCrypt.matches()
    ↓
Correct? ──YES──> Login successful
    │
    └──NO──> Reject

Do these tests and tell me the results. Then we move to Step 6E — JWT generation. 🔐🔥

-------------

i/p>>>
register first using api in postman - 
{
    "name": "aln",
    "email": "aln@example.com",
    "password": "password123"
}

then, login api on postman using dta-
{
  "email": "aln@example.com",
  "password": "password123"
}

**
Yep — 403 is expected at this stage because Spring Security is currently protecting /api/auth/login.

We need to tell Spring Security:

“Registration and login are public APIs. Don't require authentication to access them.”

Step 6E — Permit Auth APIs

Open your SecurityConfig class.

Find your authorizeHttpRequests configuration. It probably has something like:

.authorizeHttpRequests(auth -> auth
    .anyRequest().authenticated()
)

Change it to:

.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .anyRequest().authenticated()
)
🧠 What this means
/api/auth/register  → PUBLIC ✅
/api/auth/login     → PUBLIC ✅

everything else     → LOGIN REQUIRED 🔒

Why?

A user cannot provide a JWT to login, because the whole purpose of login is to obtain the JWT.

Login
  ↓
No JWT yet
  ↓
Check email + password
  ↓
Generate JWT
  ↓
Return JWT

So /login must be accessible without authentication.

Then restart and test again
POST
http://localhost:8080/api/auth/login
{
  "email": "aln@example.com",
  "password": "password123"
}

Expected:

200 OK
Login successful

Don't worry about JWT yet.

Get this working first. Then we'll move directly to JWT generation. 🔐

----------

BCrypt password hashing  , DEFINE THS.?
also, pw is saved in encrypted format, when user enters for login, pw entered also cnvrted to same encrypted format, and then both are matched ?
am i right ?

added jwtsvc, done

Yes — you're almost exactly right. 👍 Just one important terminology correction.

BCrypt password hashing — definition

BCrypt is a password-hashing algorithm used to convert a plain-text password into a one-way hash before storing it in the database.

Example:

User enters:
password123

       ↓ BCrypt

$2a$10$4kKhEvxbJFU8FCSPSuBSCOuacxwh...
Is your understanding correct?

Yes, conceptually:

REGISTRATION
password123
     ↓
 BCrypt
     ↓
hash
     ↓
PostgreSQL

Then during login:

User enters:
password123
     ↓
BCrypt verification
     ↓
compare with stored hash
     ↓
MATCH ✅

But here's the important correction:

❌ It doesn't simply encrypt the login password and compare two strings.

BCrypt is hashing, not encryption.

Encryption is generally:

data + key → encrypted data
encrypted data + key → original data

Hashing is:

password → hash

and you cannot practically reverse the hash to get the password.

Also, BCrypt uses a salt, so hashing password123 again does not necessarily produce the exact same string.

That's why Spring does:

passwordEncoder.matches(
    enteredPassword,
    storedHash
);

It checks whether the entered password corresponds to the stored BCrypt hash.

So your mental model should be:

Password is hashed when registering. During login, BCrypt verifies whether the entered password matches the stored hash.

Not:

"Both passwords are encrypted into identical strings and compared."

That's an important interview distinction. 🔥

---------------------------
----------------------------