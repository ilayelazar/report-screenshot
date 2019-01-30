var request = require("request");
const puppeteer = require("puppeteer");
var urlencode = require("urlencode");
const mailer = require("./mailer");

exports.takeSS = function(email) {
  var options = {
    method: "POST",
    url: "http://35.156.190.99:6405/biprws/logon/long",
    headers: {
      "cache-control": "no-cache",
      authorization: "Basic Og==",
      accept: "application/json",
      "content-type": "application/xml"
    },
    body:
      '<attrs xmlns="http://www.sap.com/rws/bip"> \r\n  <attr name="userName" type="string">administrator</attr>\r\n  <attr name="password" type="string">iProsis!@3</attr>\r\n  <attr name="auth" type="string" possibilities="secEnterprise,secLDAP,secWinAD,secSAPR3">secEnterprise</attr>\r\n</attrs>'
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    var res = JSON.parse(body);
    var encodedToken = urlencode.encode(res.logonToken);
    //taking screenshot

    (async () => {
      const browser = await puppeteer.launch({
        args: ["--disable-features=site-per-process"],
        headless: false
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 600 });
      var url =
        "http://35.156.190.99:8080/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=AVlrB5MZHAVCiwZ9MIRnYwA&XSYSTEM=cuid:AVQWNcIb991BtxFsJXbcqQw&LANGUAGE=he&COUNTRY=IL&XLANGUAGE=he&XQUERY=IXPLORER2&token=" +
        encodedToken;
      //console.log(url);
      //await page.goto(url);
      console.log(new Date().getSeconds());
      await page.goto(url, {
        waitUntil: "networkidle0"
      });
      //await page.frames().find(f => f.name() === "iframe");
      console.log(new Date().getSeconds());

      await page.evaluate(() => {
        setTimeout(function() {}, 700);
        document
          .getElementById("openDocChildFrame")
          .contentWindow.document.getElementById(
            "ICON_HIDE_RIGHT_PANEL_control"
          )
          .click();
        document.getElementsByClassName("openRightPanel")[0].style.display =
          "none";
      });
      setTimeout(function() {
        page.screenshot({
          path: "./image/report.png",
          clip: {
            x: 800 - 476,
            y: 142,
            width: 476,
            height: 368
          }
        });
      }, 500);
      setTimeout(function() {
        browser.close();
      }, 2000);

      mailer.sendMail(email);
      console.log("Report was sent to <" + email + ">");
    })();
  });
};
