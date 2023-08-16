import puppeteer from "puppeteer";

async function crawlKakaoLoginPage(finalUrl) {
  let browser;
  let page;
  try {
    console.log("[INFO] : start puppeteer");
    browser = await puppeteer.launch({
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

    // 페이지 넘어갈 때 까지 기다림
    await Promise.all([
      page.waitForNavigation({ timeout: 5000 }), // The promise resolves after navigation has finished
      page.click('button[type="submit"]'),
    ]);

    try {
      await page.waitForSelector(".cont_addcertify", { timeout: 5000 });
      try {
        // 기기인증을 해야하는 경우
        console.log("[INFO] : need device auth");
        await page.waitForNavigation({ timeout: 5 * 60 * 1000 + 1000 }); // 3분 기다림
      } catch (error) {
        throw "fail device auth";
      }
    } catch (error) {
      // 인증에 실패했을 때
      if (error === "fail device auth") throw error;
      // 기기인증이 필요없는 경우
      console.log("[INFO] : no need device auth");
    }

    if (!process.env.KAKAO_REDIRECT_URL.includes(page.url())) {
      // 동의가 필요한 경우 동의 페이지로 이동
      console.log("[INFO] : need agree");
      try {
        await page.waitForSelector("#agreeAll", { timeout: 5000 });
        await page.click("#agreeAll");
      } catch (error) {}
      await page.waitForSelector("button[type=submit]");
      console.log("[INFO] : click submit");
      await Promise.all([
        page.waitForNavigation({ timeout: 5000 }), // The promise resolves after navigation has finished
        page.click('button[type="submit"]'),
      ]);
    }

    if (!process.env.KAKAO_REDIRECT_URL.includes(page.url()))
      // 이상한 페이지로 이동한 경우
      throw "fail login";

    console.log("[INFO] : success login");
    if (browser) browser.close();
    return;
  } catch (error) {
    console.log("[ERROR] : fail login");
    console.log("page url =>");
    console.log(page.url());
    console.log("page html =>");
    console.log(await page.content());
    if (browser) browser.close();
    throw error;
  }
}

export default crawlKakaoLoginPage;
