let puppeteer = require("puppeteer");
let fs = require("fs");

(async function () {
  // starts browser
  let browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 400,
    args: ["--start-maximized", "--disable-notifications"],
  });
  let numberofPages = await browser.pages();
  let tab = numberofPages[0];
  // goto page
  await tab.goto("https://www.mygov.in/covid-19",{delay:100,timeout:60000});
  await tab.waitFor(10000);
   await tab.screenshot({
    path: "stats.png",
     clip: { x: 0, y: 0, width: 1500, height: 500 },
   });

  await tab.waitForSelector(".plus_icon");
  await tab.click(".plus_icon");
  await tab.waitFor(5000);
  await tab.waitForSelector("#btn-load-more");
  await tab.click("#btn-load-more");
  await tab.waitFor(5000);
  await tab.evaluate((_) => {
    window.scrollBy(0, 800);
  });

  let table = await tab.$("#state-covid-data");
  let  html = await tab.evaluate((table) => table.innerHTML, table);
  //console.log(html);
  html=`<!DOCTYPE html>
  <html>
  <head>
  <style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  </style>
  </head>
  <body>
  <table>
  ${html}
  </table>
   
  </body>
  </html>`
  fs.writeFileSync("Stats.html", html);
  await tab.waitFor(5000);
 tab.waitFor(".lang-switcher-block");
  await tab.click(".lang-switcher-block");
  console.log("Language Has Changed");
await tab.waitFor(10000);
let tab1=await browser.newPage();
  await tab1.goto("https://www.instagram.com/mygovindia/");
  await tab1.waitFor(5000)
  await tab1.evaluate((_) => {
    window.scrollBy(0, 800);
  });
  await tab1.waitFor(7000);
  let tab2=await browser.newPage();
  await tab2.goto("https://twitter.com/mygovindia");
  await tab2.waitFor(5000)
  await tab2.evaluate((_) => {
    window.scrollBy(0, 800);
  });
  await tab2.waitFor(10000);
  let tab3 = await browser.newPage();
  await tab3.goto("https://www.youtube.com/mygovindia");
  let video = await tab3.$$(".style-scope.ytd-channel-video-player-renderer");
  await Promise.all([video[0].click()]);
  await tab3.waitFor(30000);
  await Promise.all([video[0].click(), { 
    delay: 30000 }]);
 
  let tab4=await browser.newPage();
var contentHtml = fs.readFileSync(`./Stats.html`, 'utf8');
  await tab4.setContent(contentHtml);
  await tab4.waitFor(10000);
  await tab4.close();
  await  tab3.close();
  await tab2.close();
  await tab1.close();;
  await browser.close();
})();