const { Builder, Browser, By, Key, until } = require('selenium-webdriver');

const url = 'https://www.cookcountypropertyinfo.com/default.aspx'

const pin = "24034000320000"

;(async function scrape() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    try {
        await driver.get(url)
        await driver.findElement(By.id('pinBox1')).sendKeys(pin)
        await driver.findElement(By.className('btnsearch')).click()
        let taxes = await driver.findElements(By.className("dollarspace"))
        //await driver.wait(until.elementIsVisible(taxes), 1000)
        for (let t of taxes) {
            console.log(await t.getText());
        }   
    } finally {
        await driver.quit()
    }
})()