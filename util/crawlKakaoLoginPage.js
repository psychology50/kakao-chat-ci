import path from "path"

async function crawlKakaoLoginPage(finalUrl) {
  let browser;
  let page;
  
  try {
    const osPlatform = process.platform
    console.log('[INFO] Scraper running on platform: ', osPlatform); 

    const chromePathWithQuotes = process.env.CHROME_PATH;
    const chromePathWithoutQuotes = chromePathWithQuotes.replace(/'/g, '');
    // console.log("[INFO] pasing chrome path : " + chromePathWithoutQuotes)
    // console.log("[INFO] process.cwd() : " + process.cwd())

    console.log("[INFO] : start puppeteer");
    let puppeteer, chromePath;
    if (osPlatform === 'darwin') {
      puppeteer = await import("puppeteer-core");
      console.log("[INFO] : application runs on macOS");
      chromePath = path.relative(process.cwd(), chromePathWithoutQuotes);
    } else if (/^win/i.test(osPlatform)) {
      puppeteer = await import("puppeteer");
      console.log("[INFO] : application runs on Window");
      chromePath = path.relative(process.cwd(), chromePathWithoutQuotes);
    }
    
    // console.log("[INFO] : Chrome Relative Path : " + chromePath);
    browser = await puppeteer.launch({
      args: ['--incognito'],
      headless: "new",
      executablePath: chromePath, // TODO: 배포할 때는 주석 해제
    });

    console.log("[INFO] : start new page");
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
        await page.waitForNavigation({ timeout: 3 * 60 * 1000 + 1000 }); // 3분 기다림
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
    console.log(error.message);
    console.log("page url =>");
    console.log(page.url());
    console.log("page html =>");
    console.log(await page.content());
    if (browser) browser.close();
    throw error;
  }
}

export default crawlKakaoLoginPage;
