
const CK = "ck_86d59350e11f220a5ffecbfa4e95fc6ddf576c0d";
const CS = "cs_93e44918ddc454b5f2b22f8fa9e93ea26e04e060";
const WOO_URL = "https://darkorange-bat-658298.hostingersite.com/wp-json/wc/v3";

async function testConfig() {
    const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
    const authUrl = `${WOO_URL}/products?per_page=1&status=publish`;

    console.log(`Testing URL: ${authUrl}`);
    
    try {
        const response = await fetch(authUrl, {
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log("Response Body (first 500 chars):");
        console.log(text.substring(0, 500));
    } catch (error) {
        console.error("Error:", error);
    }
}

testConfig();
