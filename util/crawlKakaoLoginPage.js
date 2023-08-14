import puppeteer from "puppeteer";

async function crawlKakaoLoginPage(finalUrl) {
    try {
      console.log("[INFO] : start puppeteer");
      const browser = await puppeteer.launch({
        headless: true,
      });
      const page = await browser.newPage();
      console.log("[INFO] : start LoginPage");
      await page.goto(finalUrl);
  
      console.log("[INFO] : set LoginInputs");
      await page.waitForSelector("input[name=loginId]");
      await page.focus("input[name=loginId]");
      await page.keyboard.type(process.env.KAKAO_EMAIL);
  
      await page.waitForSelector("input[name=password]");
      await page.focus("input[name=password]");
      await page.keyboard.type(process.env.KAKAO_PASSWORD);
  
      await page.waitForSelector("button[type=submit]");
      console.log("[INFO] : click submit");
      await page.click('button[type="submit"]');
    } catch (error) {
      console.log("[ERROR] : " + error);
    }
}

export default crawlKakaoLoginPage;