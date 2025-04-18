# QuestForge

QuestForge is an RPG-inspired daily quest tracker that turns habit-building into an adventure. Users set personal quests (habits or goals), earn experience points (XP) for completing themn, level up, unlock badges, and join guilds with friends to share progress. QuestForge transforms everyday task into an engaging game, motivating users to stay productive and achieve their goals through fun and community-driven challenges.

## Project Overview
1. [Set Up Instructions](#set-up-instructions)
2. [SSL Configuration Details](#ssl-configuration-details)
3. [HTTP Headers](#http-headers)
4. [Routes and Cache Control](#routes-and-cache-control)
6. [Sources](#sources)


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

### Integrating SSL Certificate
![Screenshot 2025-02-19 160650](https://github.com/user-attachments/assets/4bfe90be-d84a-46e7-b949-b841ec2dc6e0)

While filling out the details for my OpenSSL certificate, I realized how important it is to secure personal information such as my address, email, and name. To prevent accidental leaks, I made sure to include the `.env` file and the `certs` folder in `.gitignore,` ensuring they aren’t exposed in public repositories. This not only protects sensitive data but also follows security best practices by keeping private keys confidential. Additionally, using environment variables for SSL configuration ensures compatibility across different operating systems like Windows, macOS, and Linux, making the setup more flexible and secure.

### Setting Up Server Static Files
![Screenshot 2025-02-19 232234](https://github.com/user-attachments/assets/aff67f64-485c-4a0c-93ee-3edf97fe63a6)

From Week 5 Lab: Optimizing Caching Strategies, I started learning about Cache-Control headers and how they help with performance in Express.js. Before this, I didn’t really think about how browsers handle static files like CSS and images. I just expected them to load. But without caching, every time someone visits the site, the browser requests the same files again, even if nothing has changed, which slows things down. By adding Cache-Control headers, I can make sure the browser holds onto files for a while, so they don’t have to be downloaded again right away. For example, caching images for 30 days (max-age=2592000) makes sense because images don’t change often, while caching CSS for 24 hours (max-age=86400) lets small updates go through more frequently. I’m still figuring out when to adjust these settings, but it seems like a good way to make QuestForge load faster without putting extra load on the server.

### Helmet Security Middleware
![image](https://github.com/user-attachments/assets/d36ca538-46a2-44f8-9817-c310a57f7431)

From the week 5 Lab: Optimizing Caching Strategies, I learnt about the use of the Helmet, and also from here, [Helmet.js](https://helmetjs.github.io/). This security is important for making sure my app followw best practises. Basically without it, my app would be more vulnerable to common web attacks such as clickjacking, MIME-sniffing, or cross-site scriptiong. So with minimal effort, these headers can help strengthen the sercurity of QuestForge.

Here's the breakdown of Headers, Their Security Purposes, Examples and the Businesses that were Affect by these Attacks:

| Headers | Purpose | Example | Who Was Affected? | Sources | 
| --- | --- | --- | --- | --- |
| Content-Security-Policy (CSP) | This prevents XSS attacks by restricting the sources of scripts, styles, and other resources. | A bank's website blocks third-party scripts to prevent malicious code from stealing user data. | British Airways (2018) – A Magecart attack injected malicious scripts into their website, stealing 400,000 payment details. | [British Airways fined £20m for Magecart hack that exposed 400k folks' credit card details to crooks](https://www.theregister.com/2020/10/16/british_airways_ico_fine_20m/) | 
| xFrameOptions | This prevents clickjacking attacks by blocking your site from being embedded in an iframe. | A social media platform prevents attackers from embedding its login page in an iframe to trick users into entering credentials. | Facebook (2015) – Vulnerable to clickjacking, allowing attackers to trick users into liking pages or sharing content unknowingly. | [Clickjacking Attack on Facebook: How a Tiny Attribute Can Save the Corporation](https://www.invicti.com/blog/web-security/clickjacking-attack-on-facebook-how-tiny-attribute-save-corporation/) |
| xContentTypeOptions | This stops browsers from MIME-sniffing content, reducing the risk of executing malicious files. | A file-sharing site prevents .jpg files from being treated as executable scripts to stop malware execution. | Yahoo (2014) - Attackers exploited MIME-sniffing vulnerabilities to execute malicious code disguised as images in Yahoo Mail. | [Inside the Russian hack of Yahoo: How they did it](https://www.csoonline.com/article/560623/inside-the-russian-hack-of-yahoo-how-they-did-it.html) | 
| referrerPolicy | This controls what referrer information is sent to other sites, preventing leaks of sensitive data. | A private dashboard only sends "strict-origin" to external links, so it doesn’t reveal internal URLs. | LinkedIn (2018) – Referrer data was exposed when users clicked external job links, leaking profile information. | [LinkedIn Data Leak – What We Can Do About It](https://scrubbed.net/linkedin-data-leak-what-we-can-do-about-it/) | 
| Strict Transport Security (HSTS) | This forces HTTPS connections, ensuring encrypted communication. | An e-commerce site enforces HTTPS so users never submit credit card details over an insecure HTTP connection. | Equifax (2017) – Failed to enforce HTTPS, leading to a data breach exposing personal information of approximately 147 million people. | [Equifax Data Breach Settlemen](https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement), [2017 Equifax data breach](https://en.wikipedia.org/wiki/2017_Equifax_data_breach) | 

### Setting Up HTTPS and Helmet Issues and Challenges
During the 4th week lab: Securing Web Communications with HTTP and HTTPS, I didn't really understand why understand why we needed both HTTP and HTTPS PORTS when setting up the server. Before, on some personal projects, I've always thought it was just HTTP, until web security. I kept forgetting that I have to set up both HTTP and HTTPS and setting up HTTPS was a little more complicated for me because then I have to set up these HSTS, Helmet.js middle security, redirecting HTTP to HTTPS and doing all of these SSL Certificates. I lacked knowledge before and so just kept using HTTP on some of my personal projects. And so, creating this secure app with all best industry security practises, was definitely a step up to my career and a challenge. 

During the 4th-week lab: Securing Web Communications with HTTP and HTTPS, I didn't fully understand why both HTTP and HTTPS ports were needed when setting up the server. In my earlier personal projects, I always assumed HTTP was enough, until I started learning about web security. I kept forgetting that I had to configure both, and setting up HTTPS was definitely more complicated. It required handling HSTS, setting up Helmet.js for security headers, redirecting HTTP to HTTPS, and managing SSL certificates. Before this, I lacked the knowledge and just relied on HTTP, unaware of the risks. Working on this project forced me to step up and implement industry-standard security practices, which was both a challenge and a major learning experience for my career.

## Routes and Cache Control
> Document your caching strategy choices and how they address performance and security needs. What trade-offs did you make?

To start off, I used a dynamic routing for this project. I learnt this routing method from this [GitHub Repo](https://github.com/sait-wbdv/express-instructional-repo/tree/5-dynamic-routes) created by Ashlyn Knox. With this method, QuestForge is scalable and efficient by using dynamic parameters such as `/users/:userId` and `/guilds/:guildName`. This approach keeps the codebase clean and reduces redunduncy, enhancing both flexibility and maintainability.

Now for my caching stratigy choices starting with `routes/api/users.js` and `routes/api/guilds.js`. I decided to set the `userId` cache-control as `"no-store, private"` to ensure no user data is stored anywhere and that even if caching were considered, it would only happen on the the user's own device, not on shared systems. However, without these headers, user data could be cached and served to others accidentally, leading to serious privacy and security risk.

For both of the `userName` and `guildName`, I use a public, max-age=300 (5 minutes) and stale-while-revalidate=60 for cache control. Thias caching strategy boosts performance by caching non-sesitive data, reduces server load by reusing cached responses for frequently accessed data and keeps the data fress with short caching durations and background revalidation.

## Other Challenges
one of the biggest challenges I had during this project was trying to understand how this dynamic routing works. It definitely is much cleaner now, but it took me quiet a while to figure out how to make the routing or the URL work. Like for example, the `router.get("/id/:userId", (...)` before was `router.get("/users/:userId", (...)` but then on my server.js, on the "ROUT SETUP" section, the userRouter already has `/users/`, meaning that everytime I type this URL in: `https:localhost:443/users/:userId` it was actually reading as `https:localhost:443/users/users/:userId`, which totally did not work, I kept getting a 404 error saying that the page is not found. I was frustrated until I tried the about.js instead, I removed the `/about` into just `/` which worked, I was able to get to the about page. Then I went back to the userID and change the router to just `/:userID`, I was pretty new and inexperience but then I was finally able to get it, if the user wants to search for a specific user using "id", all I need to do was just re route it as a `/id/:userId`, and it worked. 

## Sources
- [Helmet.Js](https://helmetjs.github.io/)
- [Dynamic Routing](https://github.com/sait-wbdv/express-instructional-repo/tree/5-dynamic-routes)
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Production Best Practises: Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [How to Use SSL/TLS with Node.js](https://www.sitepoint.com/how-to-use-ssltls-with-node-js/)
- [Server Static Files](https://expressjs.com/en/starter/static-files.html)


