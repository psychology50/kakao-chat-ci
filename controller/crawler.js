import puppeteer from "puppeteer";

async function crawlKakaoLoginPage() {
  console.log("[INFO] : start parsing LoginPage url");
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_REDIRECT_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log("[INFO] : parsed url : " + finalUrl);

  try {
    console.log("[INFO] : start puppeteer");
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    console.log("[INFO] : start LoginPage");
    await page.goto(finalUrl);

    console.log("[INFO] : set LoginInputs");
    await page.waitForSelector("input[name=loginId]");
    await page.focus("input[name=loginId]");
    await page.keyboard.type("[YOUR_KAKAO_EMAIL]");

    await page.waitForSelector("input[name=password]");
    await page.focus("input[name=password]");
    await page.keyboard.type("[YOUR_KAKAO_PASSWORD]");

    await page.waitForSelector("button[type=submit]");
    console.log("[INFO] : click submit");
    await page.click('button[type="submit"]');
  } catch (error) {
    console.log("[ERROR] : " + error);
  }
}

crawlKakaoLoginPage();
