# QuestForge

QuestForge is an RPG-inspired daily quest tracker that turns habit-building into an adventure. Users set personal quests (habits or goals), earn experience points (XP) for completing themn, level up, unlock badges, and join guilds with friends to share progress. QuestForge transforms everyday task into an engaging game, motivating users to stay productive and achieve their goals through fun and community-driven challenges.

## Project Overview
1. [Set Up Instructions](#set-up-instructions)
2. [SSL Configuration Details](#ssl-configuration-details)
3. [HTTP Headers](#http-headers)
4. [Routes and Cache Control](#routes-and-cache-control)


## Set Up Instructions
### 1. Clone the repository
```
git clone https://github.com/JrNerio30/QuestForge.git
cd QuestForge
```

### 2. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/en) install. Then, install the required npm packages:
```
npm install
```

### 3. SSL Configuration
For this project HTTPS testing, QuestForge uses an OpenSSL to generate a self-signed certificate.

- First, if you have not yet installed OpenSSL, here is ho you install it using a package manager, Homebrew on macOS
```
  brew install openssl
```
- Move to the `/certs` folder and generate SSL Certificates using self-signed:
```
cd certs/
openssl genrsa -out private-key.pem 2048
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```
- Then create a `.env` file to add these:
```
SSL_KEY=./certs/private-key.pem
SSL_CERT=./certs/certificate.pem
```
- Running the Server to access the app at `https://localhost:443`
```
npm run dev
```

## SSL Configuration Details
> Which SSL setup method did you choose and why? Document your decision-making process in a short paragraph, highlighting any past experiences or expectations about each method.

I tried of both of them but I was only familiar with only one. When I tried `Lets Encrypt` Certbot to automate my certificate process, I got stuck on the `--standalone` part where I had to type in a domain. Unfortunately, I don't own any domain as of yet for this project and so I sticked with the OpenSSL method for a self-signed certificate for easy HTTPS testing and development. However, despite being stuck on the Cetbot certification, I do want to use it for a secure personal porfolio website hosted on a cloud platform. With Certbot, I can save money by automatically obtaining a free SSL certificate for my domain, configure my web server and set up auto-renewal, so that my certificate never expires. For now, I'll keep using OpenSSl for testing and for practise.

## HTTP Headers
> How do the headers you chose to implement enhance your app’s security? Document your rationale.
What was the most challenging part of setting up HTTPS and Helmet? Document how you resolved any issues.


## Routes and Cache Control
> Document your caching strategy choices and how they address performance and security needs. What trade-offs did you make?

To start off, I used a dynamic routing for this project. I learnt this routing method from this [GitHub Repo](https://github.com/sait-wbdv/express-instructional-repo/tree/5-dynamic-routes) created by Ashlyn Knox. With this method, QuestForge is scalable and efficient by using dynamic parameters such as `/users/:userId` and `/guilds/:guildName`. This approach keeps the codebase clean and reduces redunduncy, enhancing both flexibility and maintainability.

Now for my caching stratigy choices starting with `routes/api/users.js` and `routes/api/guilds.js`. I decided to set the `userId` cache-control as `"no-store, private"` to ensure no user data is stored anywhere and that even if caching were considered, it would only happen on the the user's own device, not on shared systems. However, without these headers, user data could be cached and served to others accidentally, leading to serious privacy and security risk.

For both of the `userName` and `guildName`, I use a public, max-age=300 (5 minutes) and stale-while-revalidate=60 for cache control. Thias caching strategy boosts performance by caching non-sesitive data, reduces server load by reusing cached responses for frequently accessed data and keeps the data fress with short caching durations and background revalidation.

## Challenges (Extra)


