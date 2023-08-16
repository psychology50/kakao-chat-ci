import puppeteer from "puppeteer";

async function crawlKakaoLoginPage(finalUrl) {
  let page;
  try {
    console.log("[INFO] : start puppeteer");
    const browser = await puppeteer.launch({
      headless: "new",
    });
    page = await browser.newPage();
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

    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }), // The promise resolves after navigation has finished
      page.click('button[type="submit"]'),
    ]);

    if (!process.env.KAKAO_REDIRECT_URL.includes(page.url())) {
      // 동의가 필요한 경우 동의 페이지로 이동
      console.log("[INFO] : need agree");
      await page.waitForSelector("#agreeAll");
      await page.click("#agreeAll");
      await page.waitForSelector("button[type=submit]");
      console.log("[INFO] : click submit");
      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }), // The promise resolves after navigation has finished
        page.click('button[type="submit"]'),
      ]);
    }

    if (!process.env.KAKAO_REDIRECT_URL.includes(page.url()))
      // 이상한 페이지로 이동한 경동
      throw "fail login";

    console.log("[INFO] : success login");
  } catch (error) {
    console.log("[ERROR] : " + error);
  }
  if (page) page.close();
}

export default crawlKakaoLoginPage;
